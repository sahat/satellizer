/* run from mongo shell with:

load("path_to/laravel-restful-api-starter/app/database/seeds/seed_admin.js")

*/

db = db.getSiblingDB('test_api'); 	// or from shell: use test_api

db.createUser( {user:"test_user", pwd:"test_password", roles:[ { role: "readWrite", db: "test_api" } ] } );