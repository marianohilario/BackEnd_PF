import UserModel from '../../models/user.model.js'
import logger from "../../ultis/logger.js"

export class MongoUserManager{
    async addUser(user){
        try {
            return await UserModel.create(user)
        } catch (error) {
            logger.error(error)
        }
    }

    async getUsers(){
        try {
            let users = await UserModel.find()
            return users
        } catch (error) {
            logger.error(error)
        }
    }
    
    async getUser(email){
        try {
            let user = await UserModel.findOne({email: email})
            return user
        } catch (error) {
            logger.error(error)
        }
    }
}