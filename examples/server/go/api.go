package main

import (
	"encoding/json"
	"log"
	"net/http"

	"gopkg.in/mgo.v2/bson"
)

func Me(w http.ResponseWriter, r *http.Request) {
	tokenData := GetToken(w, r)
	db := GetDB(w, r)

	user, errM := FindUserById(db, bson.ObjectIdHex(tokenData.ID))
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

	decoder := json.NewDecoder(r.Body)
	var userData User
	err := decoder.Decode(&userData)
	if err != nil {
		log.Println(err)
		return
	}

	tokenData := GetToken(w, r)
	db := GetDB(w, r)

	UpdateUserById(db, bson.ObjectIdHex(tokenData.ID), userData.Email, userData.DisplayName)
	Me(w, r)

}
