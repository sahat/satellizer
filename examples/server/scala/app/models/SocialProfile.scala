package models

import play.api.libs.json.Json
import reactivemongo.bson._

trait SocialProfile {
  def id: String
  def provider: String
  def email: String
}

object SocialProfile {
  implicit object BsonHandler extends BSONDocumentReader[SocialProfile] with BSONDocumentWriter[SocialProfile] with BSONHandler[BSONDocument, SocialProfile] {
    def read(bson: BSONDocument): SocialProfile = bson.get("provider") match {
      case Some(BSONString("facebook")) => FacebookProfile.bsonHandler.read(bson)
      case other =>
        println(other)
        ???
    }
    def write(t: SocialProfile): BSONDocument = t match {
      case t: FacebookProfile => FacebookProfile.bsonHandler.write(t)
      case _ => ???
    }
  }
}

case class FacebookProfile(
  id: String,
  email: String,
  first_name: String) extends SocialProfile {
  val provider = "facebook"
}

object FacebookProfile {
  implicit val bsonHandler = Macros.handler[FacebookProfile]
  implicit val jsonFormat = Json.format[FacebookProfile]
}
