package services.user

import domain.user.User
import repositories.user.UserRepositoryComponent

trait UserServiceComponent {
    
    val userService: UserService
    
    trait UserService {
        
        def createUser(user: User): User
        
        def updateUser(user: User)
        
        def tryFindById(id: Long): Option[User]
        
        def delete(id: Long)
    
    }

}

trait UserServiceComponentImpl extends UserServiceComponent {
    self: UserRepositoryComponent =>
    
    override val userService = new UserServiceImpl
    
    class UserServiceImpl extends UserService {
        
        override def createUser(user: User): User = {
            userRepository.createUser(user)
        }
        
        override def updateUser(user: User) {
            userRepository.updateUser(user)
        }
        
        override def tryFindById(id: Long): Option[User] = {
            userRepository.tryFindById(id)
        }
        
        override def delete(id: Long) {
            userRepository.delete(id)
        }
        
    }
}
