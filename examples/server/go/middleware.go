package main

import (
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/codegangsta/negroni"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
	"gopkg.in/mgo.v2"
)

const publicKey = "keys/app.rsa.pub"

var (
	verifyKey []byte
)

func init() {
	var err error
	verifyKey, err = ioutil.ReadFile(publicKey)
	if err != nil {
		log.Fatal("Error reading Private key")
		return
	}
}
func JWTMiddleware() negroni.Handler {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		if h := r.Header.Get("Authorization"); h != "" {
			token, err := jwt.ParseFromRequest(r, func(token *jwt.Token) (interface{}, error) {
				return verifyKey, nil
			})

			switch err.(type) {
			case nil:
				if !token.Valid {
					NotAllowed(w, r)
					return
				}
				context.Set(r, "token", token)
				next(w, r)
			case *jwt.ValidationError:
				vErr := err.(*jwt.ValidationError)
				switch vErr.Errors {
				case jwt.ValidationErrorExpired:
					BR(w, r, errors.New("Token Expired"), http.StatusUnauthorized)
					return
				default:
					ISR(w, r, errors.New(vErr.Error()))
					log.Println(vErr.Error())
					return
				}
			default:
				ISR(w, r, err)
				return
			}
		} else {
			next(w, r)
		}
	})
}
func DBMiddleware(session *mgo.Session) negroni.Handler {
	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		s := session.Clone()
		defer s.Close()
		context.Set(r, "dbSession", s)
		context.Set(r, "DB", s.DB(DBNAME))
		next(w, r)
	})
}

func ParseFormMiddleware() negroni.Handler {

	return negroni.HandlerFunc(func(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		err := r.ParseForm()
		if err != nil {
			ISR(w, r, err)
			return
		}
		next(w, r)
		if strings.Contains(r.Header.Get("Content-Type"), "multipart") {
			err = r.ParseMultipartForm(1024)
			if err != nil {
				ISR(w, r, err)
				return
			}
		}

	})

}
