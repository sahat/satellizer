package main

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"gopkg.in/mgo.v2"
)

type Error struct {
	Reason   error
	Internal bool
	Code     int
}

type Response map[string]interface{}

type TokenData struct {
	ID  string
	Iat float64
	Exp float64
}

func RandToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func (r *Response) String() (s string) {
	b, err := json.Marshal(r)
	if err != nil {
		return ""
	}
	return string(b)
}

func HandleModelError(w http.ResponseWriter, r *http.Request, errM *Error) {

	if errM.Internal {
		ISR(w, r, errM.Reason)
		return
	} else {
		if errM.Code != 0 {
			BR(w, r, errM.Reason, errM.Code)

		} else {
			BR(w, r, errM.Reason, http.StatusBadRequest)
		}
		return
	}
}

func ISR(w http.ResponseWriter, r *http.Request, msg error) {
	w.WriteHeader(http.StatusInternalServerError)
	log.Println(msg)
}

func BR(w http.ResponseWriter, r *http.Request, msg error, code int) {
	ServeJSON(w, r, &Response{"error": msg.Error()}, code)
}

func NotAllowed(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusUnauthorized)
}

func ServeJSON(w http.ResponseWriter, r *http.Request, json *Response, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	fmt.Fprint(w, json)
}

func GetDB(w http.ResponseWriter, r *http.Request) *mgo.Database {
	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB"))
		return nil
	}
	return db.(*mgo.Database)
}

func GetToken(w http.ResponseWriter, r *http.Request) *TokenData {
	token, ok := context.GetOk(r, "token")
	if !ok {
		BR(w, r, errors.New("Missing Token"), http.StatusUnauthorized)
		return nil
	}

	tokenData := token.(*jwt.Token).Claims
	return &TokenData{tokenData["ID"].(string), tokenData["iat"].(float64), tokenData["exp"].(float64)}
}

func IsTokenSet(r *http.Request) bool {
	_, ok := context.GetOk(r, "token")
	return ok
}
