package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/google/go-querystring/query"
	"github.com/parnurzeal/gorequest"
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

type accessTokenData struct {
	AccessToken string `json:"access_token" url:"access_token"`
	TokenType   string `json:"token_type" url:"token_type"`
	ExpiresIn   int    `json:"expires_in" url:"expires_in"`
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
	fbparams := newFBParams()
	fbparams.LoadFromHTTPRequest(r)

	v, _ := query.Values(fbparams)
	u, _ := url.ParseRequestURI(apiUrl)
	u.Path = accessTokenPath
	u.RawQuery = v.Encode()
	urlStr := fmt.Sprintf("%v", u)

	res, body, _ := gorequest.New().Get(urlStr).End()

	if res.StatusCode != 200 {
		var errorData map[string]interface{}
		json.Unmarshal([]byte(body), &errorData)

		ServeJSON(w, r, &Response{
			"message": errorData["error"].(map[string]interface{})["message"],
		}, 500)
		return
	}

	// Step 2. Retrieve profile information about the current user.
	var atData accessTokenData
	err := json.Unmarshal([]byte(body), &atData)

	v, _ = query.Values(atData)

	u, _ = url.ParseRequestURI(apiUrl)
	u.Path = graphApiPath
	u.RawQuery = v.Encode()
	urlStr = fmt.Sprintf("%v", u)

	resProfile, body, _ := gorequest.New().Get(urlStr).End()

	var profileData map[string]interface{}
	err = json.Unmarshal([]byte(body), &profileData)

	if resProfile.StatusCode != 200 {
		ServeJSON(w, r, &Response{
			"message": profileData["error"].(map[string]interface{})["message"],
		}, 500)
		return
	}

	db := GetDB(w, r)

	if IsTokenSet(r) {
		// Step 3a. Link user accounts.
		existingUser, errM := FindUserByProvider(db, "facebook", profileData["id"].(string))
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

		tokenData := GetToken(w, r)
		user, errM := FindUserById(db, bson.ObjectIdHex(tokenData.ID))
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

		err = user.Save(db)
		if err != nil {
			ISR(w, r, errors.New("Couldn't save user profile informations"))
		}

		SetToken(w, r, user)

	} else {
		// Step 3b. Create a new user account or return an existing one.
		existingUser, errM := FindUserByProvider(db, "facebook", profileData["id"].(string))
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
		err = user.Save(db)
		if err != nil {
			ISR(w, r, err)
			return
		}

		SetToken(w, r, user)
	}
}

func LoginWithGoogle(w http.ResponseWriter, r *http.Request) {

	accessTokenUrl := "https://accounts.google.com/o/oauth2/token"
	peopleApiUrl := "https://www.googleapis.com"
	peopleApiPath := "/plus/v1/people/me/openIdConnect"

	// Step 1. Exchange authorization code for access token.
	googleParams := newGoogleParams()
	googleParams.LoadFromHTTPRequest(r)

	v, _ := query.Values(googleParams)

	res, body, _ := gorequest.New().Post(accessTokenUrl).
		Send(v.Encode()).
		Type("form").
		End()

	if res.StatusCode != 200 {
		var errorData map[string]interface{}
		json.Unmarshal([]byte(body), &errorData)

		ServeJSON(w, r, &Response{
			"message": errorData["error"].(string),
		}, 500)
		return
	}

	// Step 2. Retrieve profile information about the current user.
	var atData accessTokenData
	err := json.Unmarshal([]byte(body), &atData)

	qs, _ := query.Values(atData)

	u, _ := url.ParseRequestURI(peopleApiUrl)
	u.Path = peopleApiPath
	u.RawQuery = qs.Encode()
	urlStr := fmt.Sprintf("%v", u)

	resProfile, body, _ := gorequest.New().Get(urlStr).End()

	var profileData map[string]interface{}
	err = json.Unmarshal([]byte(body), &profileData)

	if resProfile.StatusCode != 200 {
		ServeJSON(w, r, &Response{
			"message": profileData["error"].(map[string]interface{})["message"],
		}, 500)
		return
	}

	db := GetDB(w, r)

	if IsTokenSet(r) {
		// Step 3a. Link user accounts.
		existingUser, errM := FindUserByProvider(db, "google", profileData["sub"].(string))
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

		tokenData := GetToken(w, r)
		user, errM := FindUserById(db, bson.ObjectIdHex(tokenData.ID))
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

		err = user.Save(db)
		if err != nil {
			ISR(w, r, errors.New("Couldn't save user profile informations"))
		}

		SetToken(w, r, user)

	} else {
		// Step 3b. Create a new user account or return an existing one.
		existingUser, errM := FindUserByProvider(db, "google", profileData["sub"].(string))
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
		err = user.Save(db)
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
