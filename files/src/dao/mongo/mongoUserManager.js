import userModel from "../../models/user.model.js";
import logger from "../../utils/logger.js";

export class MongoUserManager {
  async addUser(user) {
    try {
      return await userModel.create(user);
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteUser(uid) {
    try {
      let user = await userModel.findOneAndDelete( { _id : uid } )
      console.log(user);
      return user
    } catch (error) {
      logger.error(error)
    }
  }

  async getUsers(limit, page) {
    try {
      let users = await userModel.paginate( {} , { limit: limit, page: page, lean: true } );
      return users;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUser(email) {
    try {
      let user = await userModel.findOne({ email: email });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUserById(uid) {
    try {
      let user = await userModel.findOne({ _id: uid });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateUser(email, password) {
    try {
      await userModel.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
      let user = await userModel.findOne({ email: email });
      return user;
      // return "Password Updated";
    } catch (error) {
      logger.error(error);
    }
  }

  async updateRoll(email, roll) {
    try {
      let user = await userModel.updateOne(
        {
          email: email,
        },
        {
          $set: {
            roll: roll,
          },
        }
      );
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async uploadDocument(uid, data) {
    try {
      let user = await userModel.updateOne(
        {
          _id: uid,
        },
        {
          $set: {
            documents: data,
          },
        }
      );
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateLastConnection(email, data) {
    try {
      let user = await userModel.updateOne(
        {
          email: email,
        },
        {
          $set: {
            last_connection: data,
          },
        }
      );
      return user;
    } catch (error) {
      logger.error(error);
    }
  }
}
