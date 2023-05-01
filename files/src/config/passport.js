import passport from 'passport'
import GithubStrategy from 'passport-github2'
import local from 'passport-local'
import { MongoUserManager } from '../dao/mongo/mongoUserManager.js'
import { createHash, isValidPassword } from '../ultis/bcryptPass.js' 
import userModel from '../models/user.model.js'

const localStrategy = local.Strategy
const mongoUserManager = new MongoUserManager

export const initPassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id)
            done(null, user)
        } catch (error) {
            console.log(error)
            done(error)
        }
    })

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.27a6aa5f2dc735d9',
        clientSecret: 'add97dffd8275a0eda30831989701a195d3fd9a1',
        callbackURL: 'http://localhost:8080/auth/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log('accessToken: ', accessToken)
        // console.log('refreshToken: ', refreshToken)
        // console.log('profile: ', profile)

        try {
            let user = await userModel.findOne({ email: profile._json.email})
            if (!user) {
                let newUser = {
                    nombre: profile._json.name,
                    apellido: " ",
                    rol: 'user',
                    email: profile._json.email,
                    password: createHash('asd123')
                }

                let result = await userModel.create(newUser)

                return done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('login', new localStrategy(
        {usernameField: 'username'},
        async (username, password, done) => {
            console.log('login passport')
            try {

                let user = await mongoUserManager.getUser(username)

                if (!user) {
                    console.log('El usuario no existe');
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    console.log('Datos inválidos');
                    return done(null, false)
                }

                return done(null, user)

            } catch (error) {
                console.log(error);
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
            const { nombre, apellido, rol = 'user', email } = req.body
            let user = { nombre, apellido, rol, email, password: createHash(password) }
            
            try {
                let exist = await mongoUserManager.getUser(username)

                if (exist) {
                    console.log('El usuario ya existe');
                    return done(null, false)
                } else {
                    console.log('El usaurio se creó correctamente');
                    let result = await mongoUserManager.addUser(user)
                    return done(null, result)
                }
            } catch (error) {
                console.log(error);
                return done('Error al obtener el usuario' + error)
            }
        }
    ))
}