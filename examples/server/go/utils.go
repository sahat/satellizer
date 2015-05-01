package main

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Error struct {
	Reason   error
	Internal bool
	Code     int
}

type Response map[string]interface{}

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
