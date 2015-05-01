package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"gopkg.in/mgo.v2"
)

const (
	privateKey = "./keys/app.rsa"
)

var (
	signKey []byte
)

func init() {
	var err error
	signKey, err = ioutil.ReadFile(privateKey)
	if err != nil {
		log.Fatal("Error reading Private Key")
	}
}

func Login(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()

	contents, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}
	type UserData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var userData UserData
	json.Unmarshal(contents, &userData)

	if userData.Email == "" || userData.Password == "" {
		BR(w, r, errors.New("Missing credentials"), http.StatusBadRequest)
		return
	}

	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB"))
		return
	}

	user, errM := AuthUser(db.(*mgo.Database), userData.Email, userData.Password)
	if errM != nil {
		HandleModelError(w, r, errM)
		return
	}

	SetToken(w, r, user)
}

func SignUp(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	contents, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		return
	}
	type UserData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var userData UserData
	json.Unmarshal(contents, &userData)

	if userData.Email == "" || userData.Password == "" {
		BR(w, r, errors.New("Missing information"), http.StatusBadRequest)
		return
	}

	db, ok := context.GetOk(r, "DB")
	if !ok {
		ISR(w, r, errors.New("Couldn't obtain DB Session"))
	}
	user := &User{Email: userData.Email, Password: userData.Password}
	errM := CreateUser(db.(*mgo.Database), user)
	if errM != nil {
		HandleModelError(w, r, errM)
		return
	}
	SetToken(w, r, user)
}

func SetToken(w http.ResponseWriter, r *http.Request, user *User) {
	t := jwt.New(jwt.GetSigningMethod("RS256"))
	t.Claims["ID"] = user.ID.Hex()
	t.Claims["name"] = user.DisplayName
	t.Claims["exp"] = time.Now().Add(time.Minute * 60 * 24 * 30).Unix()
	tokenString, err := t.SignedString(signKey)
	if err != nil {
		ISR(w, r, err)
		return
	}
	ServeJSON(w, r, &Response{"token": tokenString}, http.StatusOK)
	return
}