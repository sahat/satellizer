package models

import play.api.libs.json.Json
import play.api.data._
import play.api.data.Forms._

case class User(email: String,
                password: String,
                firstName: String,
                lastName: String,
                facebook: String,
                google: String,
                github: String,
                foursquare: String,
                linkedin: String,
                twitter: String)

case class Feed(name: String, url: String)

object JsonFormats {
  // Generates Writes and Reads for Feed and User thanks to Json Macros
  implicit val feedFormat = Json.format[Feed]
  implicit val userFormat = Json.format[User]
}