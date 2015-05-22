package main

import (
	"fmt"
	"net/http"
	"os"
	"runtime"

	"github.com/codegangsta/negroni"
	"github.com/gorilla/mux"
)

const DBNAME = "satellizer"

var (
	PORT        = ":3000"
	MONGODB_URL = "localhost"
)

func init() {
	if p := os.Getenv("PORT"); p != "" {
		PORT = ":" + p
	}
	if m := os.Getenv("MONGODB_URL"); m != "" {
		MONGODB_URL = m
	}
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	dbSession := DBConnect(MONGODB_URL)
	DBEnsureIndices(dbSession)

	router := mux.NewRouter().StrictSlash(true)

	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/me", Me).Methods("GET")
	api.HandleFunc("/me", UpdateAccount).Methods("PUT")

	authApi := router.PathPrefix("/auth").Subrouter()
	authApi.HandleFunc("/login", Login).Methods("POST")
	authApi.HandleFunc("/signup", SignUp).Methods("POST")
	authApi.HandleFunc("/facebook", LoginWithFacebook).Methods("POST")
	authApi.HandleFunc("/twitter", LoginWithTwitter).Methods("POST")
	authApi.HandleFunc("/google", LoginWithGoogle).Methods("POST")

	n := negroni.Classic()
	n.Use(JWTMiddleware())
	n.Use(DBMiddleware(dbSession))
	n.Use(ParseFormMiddleware())
	n.UseHandler(router)

	static := router.PathPrefix("/").Subrouter()
	static.Methods("GET").Handler(http.FileServer(http.Dir("../../client")))

	fmt.Println("Launching server at http://localhost" + PORT)
	err := http.ListenAndServe(PORT, n)
	if err != nil {
		fmt.Println(err)
	}
}
