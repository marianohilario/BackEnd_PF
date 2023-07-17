import { MongoUserManager } from "../dao/mongo/mongoUserManager.js";
import { UserDTO } from "../dto/users.dto.js";
import logger from "../utils/logger.js";

const mongoUserManager = new MongoUserManager();

class SessionsService {
  async addUser(user) {
    try {
      const userDTO = new UserDTO(user);
      return await mongoUserManager.addUser(userDTO);
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteUser(uid) {
    try {
      let user = await mongoUserManager.deleteUser(uid);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUsers(limit, page) {
    try {
      let users = await mongoUserManager.getUsers(limit, page);
      return users;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUser(email) {
    try {
      let user = await mongoUserManager.getUser(email);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async getUserById(uid) {
    try {
      let user = await mongoUserManager.getUserById(uid);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateUser(email, password) {
    try {
      let user = await mongoUserManager.updateUser(email, password);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateRoll(email, roll) {
    try {
      let user = await mongoUserManager.updateRoll(email, roll);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async uploadDocument(uid, data) {
    try {
      let user = await mongoUserManager.uploadDocument(uid, data);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateLastConnection(email, data) {
    try {
      let user = await mongoUserManager.updateLastConnection(email, data);
      return user;
    } catch (error) {
      logger.error(error);
    }
  }
}

export default SessionsService;
