package main

import (
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/mrjones/oauth"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func LoginWithTwitter(w http.ResponseWriter, r *http.Request) {

	c := oauth.NewConsumer(
		config.TWITTER_KEY,
		config.TWITTER_SECRET,
		oauth.ServiceProvider{
			RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
			AuthorizeTokenUrl: "https://api.twitter.com/oauth/authenticate",
			AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
		})

	profileUrl := "https://api.twitter.com/1.1/users/show.json"

	decoder := json.NewDecoder(r.Body)
	var requestPayload struct {
		OAuthToken    string `json:"oauth_token"`
		OAuthVerifier string `json:"oauth_verifier"`
	}
	err := decoder.Decode(&requestPayload)
	if err != nil && err != io.EOF {
		log.Println(err)
		return
	}

	// Part 1/2: Initial request from Satellizer.
	if requestPayload.OAuthToken == "" || requestPayload.OAuthVerifier == "" {

		// Step 1. Obtain request token for the authorization popup.
		requestToken, _, err := c.GetRequestTokenAndUrl(config.TWITTER_CALLBACK)
		if err != nil {
			log.Println(err)
			return
		}

		// Step 2. Redirect to the authorization screen.
		ServeJSON(w, r, &Response{
			"oauth_token":              requestToken.Token,
			"oauth_token_secret":       requestToken.Secret,
			"oauth_callback_confirmed": "true",
		}, 200)
	} else {
		// Part 2/2: Second request after Authorize app is clicked.
		requestToken := &oauth.RequestToken{requestPayload.OAuthToken, config.TWITTER_SECRET}

		// Step 3. Exchange oauth token and oauth verifier for access token.
		accessToken, err := c.AuthorizeToken(requestToken, requestPayload.OAuthVerifier)
		if err != nil {
			log.Println(err)
			return
		}

		// Step 4. Retrieve profile information about the current user.
		response, err := c.Get(
			profileUrl,
			map[string]string{"screen_name": accessToken.AdditionalData["screen_name"]},
			accessToken)

		if err != nil {
			log.Fatal(err)
		}
		defer response.Body.Close()

		bits, err := ioutil.ReadAll(response.Body)

		var profileData map[string]interface{}
		err = json.Unmarshal(bits, &profileData)

		db := GetDB(w, r)

		if IsTokenSet(r) {
			// Step 5a. Link user accounts.
			existingUser, errM := FindUserByProvider(db, "twitter", accessToken.AdditionalData["user_id"])
			if existingUser != nil {
				ServeJSON(w, r, &Response{
					"message": "There is already a Twitter account that belongs to you",
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

			user.Twitter = accessToken.AdditionalData["user_id"]
			if user.DisplayName == "" {
				user.DisplayName = accessToken.AdditionalData["screen_name"]
			}
			if user.Picture == "" {
				user.Picture = strings.Replace(profileData["profile_image_url"].(string), "_normal", "", 1)
			}

			err = user.Save(db)
			if err != nil {
				ISR(w, r, errors.New("Couldn't save user profile informations"))
			}

			SetToken(w, r, user)

		} else {
			// Step 5b. Create a new user account or return an existing one.
			existingUser, errM := FindUserByProvider(db, "twitter", accessToken.AdditionalData["user_id"])
			if existingUser != nil {
				SetToken(w, r, existingUser)
				return
			}
			if errM != nil && errM.Reason != mgo.ErrNotFound {
				HandleModelError(w, r, errM)
				return
			}

			user := NewUser()
			user.Email = accessToken.AdditionalData["user_id"] + "-satellizer@twitter.com"
			user.Twitter = accessToken.AdditionalData["user_id"]
			user.DisplayName = accessToken.AdditionalData["screen_name"]
			user.Picture = strings.Replace(profileData["profile_image_url"].(string), "_normal", "", 1)
			err = user.Save(db)
			if err != nil {
				ISR(w, r, err)
				return
			}

			SetToken(w, r, user)
		}

	}
}
