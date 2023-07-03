import passport from 'passport'
import GithubStrategy from 'passport-github2'
import local from 'passport-local'
import { MongoCartManager } from '../dao/mongo/mongoCartManager.js'
import { createHash, isValidPassword } from '../ultis/bcryptPass.js' 
import userModel from '../models/user.model.js'
import SessionsService from '../services/sessionsService.js'
import logger from '../ultis/logger.js'

const localStrategy = local.Strategy
const mongoCartManager = new MongoCartManager
const sessionsService = new SessionsService

export const initPassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id)
            done(null, user)
        } catch (error) {
            logger.error(error)
            done(error)
        }
    })

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.27a6aa5f2dc735d9',
        clientSecret: 'add97dffd8275a0eda30831989701a195d3fd9a1',
        callbackURL: 'http://localhost:8080/auth/githubcallback'
    }, async (profile, done) => {

        try {
            let user = await sessionsService.getUser({ email: profile._json.email})
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    age: 41,
                    roll: 'user',
                    email: profile._json.email,
                    password: createHash('asd123')
                }

                let result = await sessionsService.addUser(newUser)

                return done(null, result)
            }
            
            return done(null, user)
            
        } catch (error) {
            logger.error(error)
            return done(error)
        }
    }))

    passport.use('login', new localStrategy(
        {usernameField: 'username'},
        async (username, password, done) => {
            logger.info('login passport')
            try {

                let user = await sessionsService.getUser(username)

                if (!user) {
                    logger.error('Error al loguearse. Usuario no existe')
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    logger.error('Error al loguearse. Password invalido')
                    return done(null, false)
                }

                logger.info(user);
                return done(null, user)

            } catch (error) {
                logger.error(error);
                return done(error)
            }
        }
    ))

    passport.use('register', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },

        async (req, username, password, done) => {
            const { first_name, last_name, age, roll = 'user', email } = req.body
            
            try {
                let exist = await sessionsService.getUser(username)

                if (exist) {
                    logger.warning('Error al registrarse. El usuario ya existe');
                    return done(null, false)
                } else {
                    let cart = await mongoCartManager.createCart()
                    let user = { first_name, last_name, age, roll, email, cart: cart._id, password: createHash(password) }
                    let result = await sessionsService.addUser(user)
                    logger.info('Usuario creado correctamente: ' + result)
                    return done(null, result)
                }
            } catch (error) {
                logger.error('Error al obtener el usuario' + error)
                return done('Error al obtener el usuario' + error)
            }
        }
    ))
}