package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._

object Users extends Controller {

  def index = Action {
    Ok("It works!")
  }

}