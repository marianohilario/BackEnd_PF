import { MongoUserManager } from "../dao/mongo/mongoUserManager.js"

const mongoUserManager = new MongoUserManager

class SessionsService {
    async getUser(email) {
        return await mongoUserManager.getUser(email)
    }
}

export default SessionsService