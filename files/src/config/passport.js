import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import { MongoCartManager } from "../dao/mongo/mongoCartManager.js";
import { createHash, comparePassword } from "../utils/bcryptPass.js";
import userModel from "../models/user.model.js";
import SessionsService from "../services/sessionsService.js";
import logger from "../utils/logger.js";
import config from "../config/config.js";

const localStrategy = local.Strategy;
const mongoCartManager = new MongoCartManager();
const sessionsService = new SessionsService();

export const initPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      logger.error(error);
      done(error);
    }
  });

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.27a6aa5f2dc735d9",
        clientSecret: "add97dffd8275a0eda30831989701a195d3fd9a1",
        callbackURL: "http://localhost:8080/auth/githubcallback",
      },
      async (profile, done) => {
        try {
          let user = await sessionsService.getUser({
            email: profile._json.email,
          });
          if (!user) {
            const cart = await mongoCartManager.createCart();
            let newUser = {
              first_name: profile.username,
              last_name: profile.username,
              age: 41,
              roll: "user",
              email: profile._json.email,
              cart: cart._id,
              password: createHash("asd123"),
            };

            let result = await sessionsService.addUser(newUser);

            return done(null, result);
          } else {
            return done(null, user)
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          let user = await sessionsService.getUser(email);

          if (!user) {
            logger.error("Not user found");
            return done(null, false);
          }

          if (!comparePassword(user, password)) {
            logger.error("Invalid Password");
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          logger.error(error);
          return done(error);
        }
      }
    )
  );
};
