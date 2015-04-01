# Introduction

The drop wizard example application was developed to, as its name implies, provide examples of some of the features
present in drop wizard.

# Overview

Included with this application is an example of the optional db API module. The examples provided illustrate a few of
the features available in [JDBI](http://jdbi.org), along with demonstrating how these are used from within dropwizard.

This database example is comprised of the following classes.

* The `PersonDAO` illustrates using the [SQL Object Queries](http://jdbi.org/sql_object_api_queries/) and string template
features in JDBI.

* All the SQL statements for use in the `PersonDAO` are located in the `Person` class.

* `migrations.xml` illustrates the usage of `dropwizard-migrations` which can create your database prior to running
your application for the first time.

* The `PersonResource` and `PeopleResource` are the REST resource which use the PersonDAO to retrieve data from the database, note the injection
of the PersonDAO in their constructors.

As with all the modules the db example is wired up in the `initialize` function of the `HelloWorldApplication`.

# Running The Application

To test the example application run the following commands.

* Setup your sanitizer client example.

    mkdir src/main/resources/assets
    cp -r ../../client/* src/main/resources/assets

* To package the example run.

        mvn package

* To setup the h2 database run.

        java -jar target/dropwizard-example-1.0.0.jar db migrate example.yml

* To run the server run.

        java -jar target/dropwizard-example-1.0.0.jar server example.yml

* To hit this url to access the service example.

	http://localhost:3000/

* To post data into the application you have use your login credentials in example (first line should be done once).

    curl -s -H "Content-Type: application/json" -X POST -d '{"email":"test@test.com","password":"testtest"}' http://localhost:3000/auth/login | grep -ioE '"[^"]*"' | tail -1 | grep -ioE '[^"]*[^"]' | awk '{print "Authorization : OAuth " $1}' > a.txt

	curl -H "Content-Type: application/json" -H "$(cat a.txt)" -X PUT -d '{"displayName":"Other Person","email":"other@test.com"}' http://localhost:3000/api/me

    curl -H "$(cat a.txt)" http://localhost:3000/api/me