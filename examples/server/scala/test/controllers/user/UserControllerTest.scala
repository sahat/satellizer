package controllers.user

import scala.concurrent.duration._
import scala.concurrent.Await
import org.junit._
import org.junit.Assert._
import org.mockito.Mockito._
import play.api.test._
import play.api.test.Helpers._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import services.user.UserServiceComponent
import domain.user.User

class UserControllerTest {
    
    private val userController = new UserController with UserServiceComponentMock {}
    /*
    @Test
    def createUser() {
        val email = "abc@test.com"
        val request = FakeRequest(POST, "/users")
                          .withBody(
                              Json.obj(
                                  "email" -> email
                              )
                          )
        
        val hey: Result = Await.ready(userController.createUser(request), Duration("10 seconds"))
        
        assertEquals(201, status(hey))
        verify(userController.userService).createUser(User(Option.empty, email))
    }
    
    @Test
    def updateUser() {
        val id = 1
        val request = FakeRequest(PUT, s"/users/$id")
                          .withBody(
                              Json.obj(
                                  "email" -> "abc@test.com"
                              )
                          )
        
        val hey: Result = userController.createUser(request)
        
        assertEquals(201, status(hey))
    }
    */

}

trait UserServiceComponentMock extends UserServiceComponent {
    
    override val userService = mock(classOf[UserService])
    
}
