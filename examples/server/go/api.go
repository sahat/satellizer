package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func Me(w http.ResponseWriter, r *http.Request) {
	token, ok := context.GetOk(r, "token")
	if !ok {
		BR(w, r, errors.New("Missing Token"), http.StatusUnauthorized)
		return
	}

	tokenData := token.(*jwt.Token).Claims
	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB"))
		return
	}

	user, errM := FindUserById(db.(*mgo.Database), bson.ObjectIdHex(tokenData["ID"].(string)))
	if errM != nil {
		HandleModelError(w, r, errM)
		return
	}
	b, _ := json.Marshal(user)
	parse := &Response{}
	json.Unmarshal(b, parse)
	ServeJSON(w, r, parse, http.StatusOK)
}

func UpdateAccount(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	contents, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}
	var userData User
	json.Unmarshal(contents, &userData)

	token, ok := context.GetOk(r, "token")
	if !ok {
		BR(w, r, errors.New("Missing token"), http.StatusUnauthorized)
		return
	}
	tokenData := token.(*jwt.Token).Claims
	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB"))
		return
	}
	UpdateUserById(db.(*mgo.Database), bson.ObjectIdHex(tokenData["ID"].(string)), userData.Email, userData.DisplayName)
	Me(w, r)

}
