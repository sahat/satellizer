package controllers

import akka.actor.ActorSystem
import akka.util.Timeout
import play.modules.reactivemongo.MongoController
import reactivemongo.api.DB
import utils.QueryStringParser

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import akka.pattern.ask

import play.api.libs.ws.WS
import play.api.mvc._
import play.api.libs.json.{Json, JsValue, JsSuccess, JsError}
import play.api.Play.current

import models.{User, FacebookProfile}

import services.{UserService, JWTService}
import services.JWTService.Generate
import services.UserService.CreateOrMergeUser

object Authentication extends Controller with MongoController {
  val system: ActorSystem = ActorSystem("authentication")
  implicit val timeout = Timeout.intToTimeout(60 * 1000) // Long timeout because we do two operation over internet
  val userService = system.actorOf(UserService.props(db))
  val jwtService = system.actorOf(JWTService.props)

  case class AuthData(redirectUri: String, code: String)
  object AuthData {
    implicit val fmt = Json.format[AuthData]

    def fromRequest(implicit request: Request[JsValue]) =
      request.body.validate[AuthData]
  }

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def facebook() = Action.async(parse.json) { implicit request =>
    val clientId = "your-facebook-app-id"
    val clientSecret = "your-facebook-app-secret"
    val accessTokenUrl = "https://graph.facebook.com/oauth/access_token"
    val graphApiUrl = "https://graph.facebook.com/me"
    AuthData.fromRequest match {
      case JsSuccess(data, _) =>
        // Step 1. Exchange authorization code for access token.
        val accessTokenData =
          WS.url(accessTokenUrl)
            .withQueryString(
              "redirect_uri" -> data.redirectUri,
              "code" -> data.code,
              "client_id" -> clientId,
              "client_secret" -> clientSecret)
            .get
            .map(_.body)
            .map(QueryStringParser.parse)
            .map(_.get)

        val accessToken = accessTokenData.map(_("access_token"))

        // Step 2. Retrieve information about the current user.
        val profile = accessToken.flatMap{ t =>
          WS.url(graphApiUrl)
            .withQueryString("access_token" -> t)
            .get
        }.map(_.json.validate[FacebookProfile]).map(_.get)

        // Step 3. update/merge/create our data and fetch user
        val user = profile.flatMap(userService ? CreateOrMergeUser(_)).mapTo[User]

        // Step 4. Generate JWT and send it back to client
        val token = user.flatMap(jwtService ? Generate(_)).mapTo[String]

        token map { t =>
          Created(Json.obj("token" -> t))
        } recover {
          case e: Exception =>
            println(e)
            InternalServerError
        }
      case e: JsError =>
        Future successful BadRequest(JsError.toFlatJson(e))
    }
  }

  def foursquare() = Action.async(parse.json) { implicit request =>
    ???
  }

  def google() = Action.async(parse.json) { implicit request =>
    ???
  }

  def github() = Action.async(parse.json) { implicit request =>
    ???
  }

  def linkedin() = Action.async(parse.json) { implicit request =>
    ???
  }

  def twitter() = Action.async(parse.json) { implicit request =>
    ???
  }


}
