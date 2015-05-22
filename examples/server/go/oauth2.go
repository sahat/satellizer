package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/go-querystring/query"
	"github.com/gorilla/context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type OAuth2Params struct {
	Code         string `json:"code" url:"code"`
	ClientId     string `json:"client_id" url:"client_id"`
	ClientSecret string `json:"client_secret" url:"client_secret"`
	RedirectUri  string `json:"redirect_uri" url:"redirect_uri"`
	GrantType    string `json:"grant_type,omitempty" url:"grant_type,omitempty"`
}

func (f *OAuth2Params) LoadFromHTTPRequest(r *http.Request) {
	type requestData struct {
		Code        string `json:"code"`
		ClientId    string `json:"clientId"`
		RedirectUri string `json:"redirectUri"`
	}
	decoder := json.NewDecoder(r.Body)

	var data requestData
	err := decoder.Decode(&data)

	if err != nil {
		panic(err)
	}
	f.Code = data.Code
	f.ClientId = data.ClientId
	f.RedirectUri = data.RedirectUri
}

func newFBParams() *OAuth2Params {
	return &OAuth2Params{
		ClientSecret: config.FACEBOOK_SECRET,
	}
}

func newGoogleParams() *OAuth2Params {
	return &OAuth2Params{
		ClientSecret: config.GOOGLE_SECRET,
		GrantType:    "authorization_code",
	}
}

func LoginWithFacebook(w http.ResponseWriter, r *http.Request) {
	apiUrl := "https://graph.facebook.com"
	accessTokenPath := "/v2.3/oauth/access_token"
	graphApiPath := "/v2.3/me"

	// Step 1. Exchange authorization code for access token.
	client := NewClient()

	fbparams := newFBParams()
	fbparams.LoadFromHTTPRequest(r)

	v, _ := query.Values(fbparams)
	u, _ := url.ParseRequestURI(apiUrl)
	u.Path = accessTokenPath
	u.RawQuery = v.Encode()
	urlStr := fmt.Sprintf("%v", u)

	req, err := http.NewRequest("GET", urlStr, nil)
	req.Close = true
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	res, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return
	}

	defer res.Body.Close()
	contents, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err)
		return
	}

	if res.StatusCode != 200 {
		var errorData map[string]interface{}
		err = json.Unmarshal(contents, &errorData)

		ServeJSON(w, r, &Response{
			"message": errorData["error"].(map[string]interface{})["message"],
		}, 500)
		return
	}

	// Step 2. Retrieve profile information about the current user.
	type accessTokenData struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		ExpiresIn   int    `json:"expires_in"`
	}

	var atData accessTokenData
	err = json.Unmarshal(contents, &atData)

	qs := url.Values{}
	qs.Set("access_token", atData.AccessToken)
	qs.Set("token_type", atData.TokenType)
	qs.Set("expires_in", strconv.Itoa(atData.ExpiresIn))

	u, _ = url.ParseRequestURI(apiUrl)
	u.Path = graphApiPath
	u.RawQuery = qs.Encode()
	urlStr = fmt.Sprintf("%v", u)

	reqProfile, err := http.NewRequest("GET", urlStr, nil)
	reqProfile.Close = true
	reqProfile.Header.Set("Content-Type", "application/json")
	reqProfile.Header.Set("Accept", "application/json")

	resProfile, err := client.Do(reqProfile)
	if err != nil {
		log.Println(err)
		return
	}

	defer resProfile.Body.Close()
	contents, err = ioutil.ReadAll(resProfile.Body)
	if err != nil {
		log.Println(err)
		return
	}

	var profileData map[string]interface{}
	err = json.Unmarshal(contents, &profileData)

	if resProfile.StatusCode != 200 {
		ServeJSON(w, r, &Response{
			"message": profileData["error"].(map[string]interface{})["message"],
		}, 500)
		return
	}

	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB"))
		return
	}

	jwtToken, ok := context.GetOk(r, "token")
	if ok {
		// Step 3a. Link user accounts.
		existingUser, errM := FindUserByQuery(db.(*mgo.Database), bson.M{"facebook": profileData["id"].(string)})
		if existingUser != nil {
			ServeJSON(w, r, &Response{
				"message": "There is already a Facebook account that belongs to you",
			}, 409)
			return
		}

		if errM != nil && errM.Reason != mgo.ErrNotFound {
			HandleModelError(w, r, errM)
			return
		}

		tokenData := jwtToken.(*jwt.Token).Claims
		user, errM := FindUserById(db.(*mgo.Database), bson.ObjectIdHex(tokenData["ID"].(string)))
		if user == nil {
			ServeJSON(w, r, &Response{
				"message": "User not found",
			}, 400)
			return
		}

		if errM != nil && errM.Reason != mgo.ErrNotFound {
			HandleModelError(w, r, errM)
			return
		}

		user.Facebook = profileData["id"].(string)
		if user.Picture == "" {
			user.Picture = "https://graph.facebook.com/v2.3/" + profileData["id"].(string) + "/picture?type=large"
		}
		if user.DisplayName == "" {
			user.DisplayName = profileData["name"].(string)
		}

		err = user.Save(db.(*mgo.Database))
		if err != nil {
			ISR(w, r, errors.New("Couldn't save user profile informations"))
		}

		SetToken(w, r, user)

	} else {
		// Step 3b. Create a new user account or return an existing one.
		existingUser, errM := FindUserByQuery(db.(*mgo.Database), bson.M{"facebook": profileData["id"].(string)})
		if existingUser != nil {
			SetToken(w, r, existingUser)
			return
		}
		if errM != nil && errM.Reason != mgo.ErrNotFound {
			HandleModelError(w, r, errM)
			return
		}

		// Create user with his facebook id
		user := NewUser()
		user.Facebook = profileData["id"].(string)
		user.Email = profileData["email"].(string)
		user.Picture = "https://graph.facebook.com/v2.3/" + profileData["id"].(string) + "/picture?type=large"
		user.DisplayName = profileData["name"].(string)
		err = user.Save(db.(*mgo.Database))
		if err != nil {
			ISR(w, r, err)
			return
		}

		SetToken(w, r, user)
	}
}

func LoginWithGoogle(w http.ResponseWriter, r *http.Request) {

	accessTokenUrl := "https://accounts.google.com"
	accessTokenPath := "/o/oauth2/token"
	peopleApiUrl := "https://www.googleapis.com"
	peopleApiPath := "/plus/v1/people/me/openIdConnect"

	// Step 1. Exchange authorization code for access token.
	client := NewClient()

	googleParams := newGoogleParams()
	googleParams.LoadFromHTTPRequest(r)

	v, _ := query.Values(googleParams)

	u, _ := url.ParseRequestURI(accessTokenUrl)
	u.Path = accessTokenPath
	urlStr := fmt.Sprintf("%v", u)

	req, err := http.NewRequest("POST", urlStr, nil)
	req.Body = ioutil.NopCloser(strings.NewReader(v.Encode()))
	req.Close = true
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-length", strconv.Itoa(len(v.Encode())))

	res, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return
	}

	defer res.Body.Close()
	contents, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err)
		return
	}

	if res.StatusCode != 200 {
		var errorData map[string]interface{}
		err = json.Unmarshal(contents, &errorData)

		ServeJSON(w, r, &Response{
			"message": errorData["error"].(string),
		}, 500)
		return
	}

	// Step 2. Retrieve profile information about the current user.
	type accessTokenData struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		ExpiresIn   int    `json:"expires_in"`
	}

	var atData accessTokenData
	err = json.Unmarshal(contents, &atData)

	qs := url.Values{}
	qs.Set("access_token", atData.AccessToken)
	qs.Set("token_type", atData.TokenType)
	qs.Set("expires_in", strconv.Itoa(atData.ExpiresIn))

	u, _ = url.ParseRequestURI(peopleApiUrl)
	u.Path = peopleApiPath
	u.RawQuery = qs.Encode()
	urlStr = fmt.Sprintf("%v", u)

	reqProfile, err := http.NewRequest("GET", urlStr, nil)
	reqProfile.Close = true
	reqProfile.Header.Set("Content-Type", "application/json")
	reqProfile.Header.Set("Accept", "application/json")

	resProfile, err := client.Do(reqProfile)
	if err != nil {
		log.Println(err)
		return
	}

	defer resProfile.Body.Close()
	contents, err = ioutil.ReadAll(resProfile.Body)
	if err != nil {
		log.Println(err)
		return
	}

	var profileData map[string]interface{}
	err = json.Unmarshal(contents, &profileData)

	if resProfile.StatusCode != 200 {
		ServeJSON(w, r, &Response{
			"message": profileData["error"].(map[string]interface{})["message"],
		}, 500)
		return
	}

	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB"))
		return
	}

	jwtToken, ok := context.GetOk(r, "token")
	if ok {
		// Step 3a. Link user accounts.
		existingUser, errM := FindUserByQuery(db.(*mgo.Database), bson.M{"google": profileData["sub"].(string)})
		if existingUser != nil {
			ServeJSON(w, r, &Response{
				"message": "There is already a Facebook account that belongs to you",
			}, 409)
			return
		}

		if errM != nil && errM.Reason != mgo.ErrNotFound {
			HandleModelError(w, r, errM)
			return
		}

		tokenData := jwtToken.(*jwt.Token).Claims
		user, errM := FindUserById(db.(*mgo.Database), bson.ObjectIdHex(tokenData["ID"].(string)))
		if user == nil {
			ServeJSON(w, r, &Response{
				"message": "User not found",
			}, 400)
			return
		}

		if errM != nil && errM.Reason != mgo.ErrNotFound {
			HandleModelError(w, r, errM)
			return
		}

		user.Google = profileData["sub"].(string)
		if user.Picture == "" {
			user.Picture = strings.Replace(profileData["picture"].(string), "sz=50", "sz=200", -1)
		}
		if user.DisplayName == "" {
			user.DisplayName = profileData["name"].(string)
		}

		err = user.Save(db.(*mgo.Database))
		if err != nil {
			ISR(w, r, errors.New("Couldn't save user profile informations"))
		}

		SetToken(w, r, user)

	} else {
		// Step 3b. Create a new user account or return an existing one.
		existingUser, errM := FindUserByQuery(db.(*mgo.Database), bson.M{"facebook": profileData["sub"].(string)})
		if existingUser != nil {
			SetToken(w, r, existingUser)
			return
		}
		if errM != nil && errM.Reason != mgo.ErrNotFound {
			HandleModelError(w, r, errM)
			return
		}

		// Create user with his google id
		user := NewUser()
		user.Google = profileData["sub"].(string)
		user.Email = profileData["email"].(string)
		user.Picture = strings.Replace(profileData["picture"].(string), "sz=50", "sz=200", -1)
		user.DisplayName = profileData["name"].(string)
		err = user.Save(db.(*mgo.Database))
		if err != nil {
			ISR(w, r, err)
			return
		}

		SetToken(w, r, user)
	}
}

func NewClient() *http.Client {
	return &http.Client{}
}
