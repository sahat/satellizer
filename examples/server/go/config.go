package main

import "os"

type Configuration struct {
	FACEBOOK_SECRET     string
	FOURSQUARE_SECRET   string
	GOOGLE_SECRET       string
	GITHUB_SECRET       string
	LINKEDIN_SECRET     string
	WINDOWS_LIVE_SECRET string
	TWITTER_KEY         string
	TWITTER_SECRET      string
	TWITTER_CALLBACK    string
	YAHOO_SECRET        string
}

var config *Configuration

func init() {
	config = &Configuration{
		FACEBOOK_SECRET:     os.Getenv("FACEBOOK_SECRET"),
		FOURSQUARE_SECRET:   os.Getenv("FOURSQUARE_SECRET"),
		GOOGLE_SECRET:       os.Getenv("GOOGLE_SECRET"),
		GITHUB_SECRET:       os.Getenv("GITHUB_SECRET"),
		LINKEDIN_SECRET:     os.Getenv("LINKEDIN_SECRET"),
		WINDOWS_LIVE_SECRET: os.Getenv("WINDOWS_LIVE_SECRET"),
		TWITTER_KEY:         os.Getenv("TWITTER_KEY"),
		TWITTER_SECRET:      os.Getenv("TWITTER_SECRET"),
		TWITTER_CALLBACK:    os.Getenv("TWITTER_CALLBACK"),
		YAHOO_SECRET:        os.Getenv("YAHOO_SECRET"),
	}
}
