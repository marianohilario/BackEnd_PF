import { MongoUserManager } from "../dao/mongo/mongoUserManager.js"
import { UserDTO } from "../dto/users.dto.js"
import logger from "../ultis/logger.js"

const mongoUserManager = new MongoUserManager

class SessionsService {

    async addUser(user) {
        try {
            const userDTO = new UserDTO(user)
            return await mongoUserManager.addUser(userDTO)
        } catch (error) {
            logger.error(error);
        }
    }

    async getUsers() {
        try {
            let users = await mongoUserManager.getUsers()
            return users
        } catch (error) {
            logger.error(error);
        }
    }

    async getUser(email) {
        try {
            let user = await mongoUserManager.getUser(email)
            return user
        } catch (error) {
            logger.error(error);
        }
    }
}

export default SessionsService