package services.user

import org.mockito.Mockito._
import org.junit.Test
import org.junit.Assert._
import repositories.user.UserRepositoryComponent
import domain.user.User

class UserServiceTest extends UserServiceComponentImpl
                      with UserRepositoryMockComponent {
    
    @Test
    def createUser() {
        val user = User(Option.empty, "foo@test.com")
        
        userService.createUser(user)
        
        verify(userRepository).createUser(user)
    }
    
    @Test
    def updateUser() {
        val user = User(Option(1L), "foo@test.com")
                
        userService.updateUser(user)
                
        verify(userRepository).updateUser(user)
    }
    
    @Test
    def findByIdDefined() {
        val id = 1L
        val user = User(Option(id), "foo@test.com")
        when(userRepository.tryFindById(id)).thenReturn(Option(user))
                
        val retrievedUser = userService.tryFindById(id)
        
        assertEquals(user, retrievedUser.get)
        verify(userRepository).tryFindById(id)
    }
    
    @Test
    def findByIdEmpty() {
        val id = 1L
        when(userRepository.tryFindById(id)).thenReturn(Option.empty)
        
        val retrievedUser = userService.tryFindById(id)
        
        assertEquals(Option.empty, retrievedUser)
        verify(userRepository).tryFindById(id)
    }
    
    @Test
    def delete() {
        val id = 1L
        
        userService.delete(id)
        
        verify(userRepository).delete(id)
    }

}

trait UserRepositoryMockComponent extends UserRepositoryComponent {
    
    override val userRepository = mock(classOf[UserRepository])
    
}
