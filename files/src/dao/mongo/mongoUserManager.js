import UserModel from "../../models/user.model.js";
import logger from "../../utils/logger.js";

export class MongoUserManager {
  async addUser(user) {
    try {
      return await UserModel.create(user);
    } catch (error) {
      logger.error(error);
    }
  }

  async getUsers() {
    try {
      let users = await UserModel.find();
      return users;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUser(email) {
    try {
      let user = await UserModel.findOne({ email: email });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUserById(uid) {
    try {
      let user = await UserModel.findOne({ _id: uid });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateUser(email, password) {
    try {
      logger.info("MongoUserDAO");
      logger.info(`email MongoUserDAO: ${email}`);
      logger.info(`password MongoUserDAO: ${password}`);
      await UserModel.findOneAndUpdate(
        { email: email },
        { $set: { password: password } }
      );
      let user = await UserModel.findOne({ email: email });
      logger.info(`user: ${user}`);
      logger.info(`user.password: ${user.password}`);
      logger.info("Password actualizado");
      return "Password Updated";
    } catch (error) {
      logger.error(error);
    }
  }

  async updateRoll(email, roll) {
    try {
      let user = await UserModel.updateOne(
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
      let user = await UserModel.updateOne(
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
      let user = await UserModel.updateOne(
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
