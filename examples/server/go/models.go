package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"

	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func DBConnect(address string) *mgo.Session {
	session, err := mgo.Dial(address)
	if err != nil {
		panic(err)
	}
	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		for sig := range c {
			log.Println("%v captured - Closing database connection", sig)
			session.Close()
			os.Exit(1)
		}
	}()

	return session
}

func DBEnsureIndices(s *mgo.Session) error {
	i := mgo.Index{
		Key:        []string{"email"},
		Unique:     true,
		Background: true,
		Name:       "email",
	}
	return s.DB(DBNAME).C("users").EnsureIndex(i)
}

type User struct {
	ID          bson.ObjectId `bson:"_id" json:"-"`
	Email       string        `bson:"email" json:"email"`
	Password    string        `bson:"password,omitempty" json:"-"`
	DisplayName string        `bson:"displayName,omitempty" json:"displayName,omitempty"`
	Picture     string        `bson:"picture,omitempty" json:"picture,omitempty"`
	Facebook    string        `bson:"facebook,omitempty" json:"facebook,omitempty"`
	Foursquare  string        `bson:"foursquare,omitempty" json:"foursquare,omitempty"`
	Google      string        `bson:"google,omitempty" json:"google,omitempty"`
	Github      string        `bson:"github,omitempty" json:"github,omitempty"`
	Linkedin    string        `bson:"linkedin,omitempty" json:"linkedin,omitempty"`
	Live        string        `bson:"live,omitempty" json:"live,omitempty"`
	Yahoo       string        `bson:"yahoo,omitempty" json:"yahoo,omitempty"`
	Twitter     string        `bson:"twitter,omitempty" json:"twitter,omitempty"`
}

func (u *User) Save(db *mgo.Database) error {
	uC := db.C("users")
	_, err := uC.UpsertId(u.ID, bson.M{"$set": u})
	return err
}

func NewUser() (u *User) {
	u = &User{}
	u.ID = bson.NewObjectId()
	return
}

func CreateUser(db *mgo.Database, u *User) *Error {
	uC := db.C("users")
	pwHash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return &Error{Reason: errors.New("Couldn't hash password"), Internal: true}
	}
	u.Password = string(pwHash)
	u.ID = bson.NewObjectId()
	err = uC.Insert(u)
	if mgo.IsDup(err) {
		return &Error{Reason: errors.New("User already exists"), Internal: false}
	}
	return nil
}

func AuthUser(db *mgo.Database, email, password string) (*User, *Error) {
	uC := db.C("users")
	user := &User{}
	err := uC.Find(bson.M{"email": email}).One(user)
	if err != nil {
		if err == mgo.ErrNotFound {
			return nil, &Error{Reason: errors.New("User wasn't found on our servers"), Internal: false}
		}
		return nil, &Error{Reason: err, Internal: true}
	}
	if user.ID == "" {
		return nil, &Error{Reason: errors.New("No user found"), Internal: false}
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, &Error{Reason: errors.New("Incorrect password"), Internal: false, Code: http.StatusUnauthorized}
	}
	return user, nil

}

func FindUserByQuery(db *mgo.Database, query bson.M) (*User, *Error) {
	uC := db.C("users")
	user := &User{}
	err := uC.Find(query).One(user)
	if err != nil {
		return nil, &Error{Reason: err, Internal: true}
	} else if user.ID == "" {
		return nil, &Error{Reason: errors.New("No user found"), Internal: false}
	}
	return user, nil
}

func FindUserById(db *mgo.Database, id bson.ObjectId) (*User, *Error) {
	uC := db.C("users")
	user := &User{}
	err := uC.FindId(id).One(user)
	if err != nil {
		return nil, &Error{Reason: err, Internal: true}
	} else if user.ID == "" {
		return nil, &Error{Reason: errors.New("No user found"), Internal: false}
	}
	return user, nil
}

func FindUserByProvider(db *mgo.Database, provider, sub string) (*User, *Error) {
	return FindUserByQuery(db, bson.M{provider: sub})
}

func UpdateUserById(db *mgo.Database, id bson.ObjectId, email, displayName string) *Error {
	uC := db.C("users")
	user, errM := FindUserById(db, id)
	if errM != nil {
		return errM
	}
	if displayName == "" {
		displayName = user.DisplayName
	}
	if email == "" {
		email = user.Email
	}
	err := uC.Update(bson.M{"_id": id}, bson.M{"$set": bson.M{"email": email, "displayName": displayName}})

	if err != nil {
		return &Error{Reason: errors.New("No user found"), Internal: false}
	}
	return nil

}
