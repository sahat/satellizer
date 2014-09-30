package models

import play.api.libs.json.Json
import play.modules.reactivemongo.json.BSONFormats._
import reactivemongo.bson.{BSONObjectID, Macros}

case class User(id: Option[BSONObjectID],
                emails: Set[String],
                registeredAccount: Option[RegisteredAccount],
                socialAccounts: SocialAccounts)

case class RegisteredAccount(email: String, password: String)

case class SocialAccounts(
  facebook: Option[FacebookProfile]
//  google: Option[SocialProfile],
//  github: Option[SocialProfile],
//  foursquare: Option[SocialProfile],
//  linkedin: Option[SocialProfile],
//  twitter: Option[SocialProfile]
)

object User {
  implicit val registeredAccountBsonFormat = Macros.handler[RegisteredAccount]
  implicit val registeredAccountJsonFormat = Json.format[RegisteredAccount]

  implicit val socialAccountsBsonFormat = Macros.handler[SocialAccounts]
  implicit val socialAccountsJsonFormat = Json.format[SocialAccounts]

  implicit val bsonFormat = Macros.handler[User]
  implicit val jsonFormat = Json.format[User]
}
