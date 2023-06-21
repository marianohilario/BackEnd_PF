import { MongoUserManager } from "../dao/mongo/mongoUserManager.js"
import { UserDTO } from "../dto/users.dto.js"

const mongoUserManager = new MongoUserManager

class SessionsService {

    async addUser(user) {
        try {
            const userDTO = new UserDTO(user)
            return await mongoUserManager.addUser(userDTO)
        } catch (error) {
            console.log(error);
        }
    }

    async getUsers() {
        try {
            let users = await mongoUserManager.getUsers()
            return users
        } catch (error) {
            console.log(error);
        }
    }

    async getUser(email) {
        try {
            let user = await mongoUserManager.getUser(email)
            return user
        } catch (error) {
            console.log(error);    
        }
    }
}

export default SessionsService