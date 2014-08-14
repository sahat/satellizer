/* run from mongo shell with:

load("/Users/jeremy/Sites/baolabs/app/database/seeds/seed_admin.js")

*/

db = db.getSiblingDB('test_api'); 	// or from shell: use test_api

db.system.users.remove({"_id":"test_api.test_user"});