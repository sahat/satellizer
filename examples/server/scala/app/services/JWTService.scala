package services

import akka.actor.{Props, Actor}
import models.User

class JWTService extends Actor {
  import JWTService._

  def receive = {
    case Generate(u) => sender() ! u.id.toString // TODO: Real implementation!
  }
}

object JWTService {
  case class Generate(user: User)

  def props = Props(new JWTService)
}
