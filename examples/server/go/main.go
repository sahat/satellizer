package main

import (
	"./routes"

	"github.com/hypebeast/gojistatic"
	"github.com/zenazn/goji"
)

func main() {
	// Serve static files
	goji.Use(gojistatic.Static("public", gojistatic.StaticOptions{SkipLogging: true}))

	// Add routes
	routes.Include()

	// Run Goji
	goji.Serve()
}