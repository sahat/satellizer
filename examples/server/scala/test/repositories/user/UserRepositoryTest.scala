package repositories.user

import org.junit.Test
import org.junit.Assert._
import domain.user.User

class UserRepositoryTest extends UserRepositoryComponentImpl {
    
    @Test
    def crud() {
        // Creation.
        val email = "foo@test.com"
        val user = User(Option.empty, email)
        val createdUser = userRepository.createUser(user)
        
        assertTrue(createdUser.id.isDefined)
        
        // Retrieval.
        var retrievedUser = userRepository.tryFindById(createdUser.id.get)
        assertTrue(retrievedUser.isDefined)
        assertEquals(createdUser.id, retrievedUser.get.id)
        assertEquals(email, retrievedUser.get.email)
        
        // Update, retrieval and check.
        val updatedEmail = "bar@test.com"
        val updatedUser = User(createdUser.id, updatedEmail)
        userRepository.updateUser(updatedUser)
        
        retrievedUser = userRepository.tryFindById(createdUser.id.get)
        assertTrue(retrievedUser.isDefined)
        assertEquals(updatedUser.id, retrievedUser.get.id)
        assertEquals(updatedEmail, retrievedUser.get.email)
        
        // Delete.
        userRepository.delete(createdUser.id.get)
        assertTrue(userRepository.tryFindById(createdUser.id.get).isEmpty)
    }
    
}