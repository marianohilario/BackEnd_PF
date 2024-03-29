import config from '../config/config.js'
import { MongoCartManager } from '../dao/mongo/mongoCartManager.js'
import SessionsService from '../services/sessionsService.js'
import { createHash } from '../utils/bcryptPass.js';

const sessionsService = new SessionsService;
const mongoCartManager = new MongoCartManager;

class LoginController {
    loginRender = (req, res) => {
        res.render('auth/login')
    }

    registerRender = (req, res) => {
        res.render('auth/register')
    }

    failLoginRender = (req, res) => {
        req.flash('error_msg', 'Not user found')
        res.redirect('/auth/login')
    }

    failRegisterRender = (req, res) => {
        res.send({status: 'Error', msg: 'Falló el registro'})
    }

    login = async (req, res) => {
        if(!req.user) return res.status(400).send({status: 'error', error: 'Credenciales inválidas'})
        const { password } = req.body
        try {
            
            if (req.user.email === config.adminName && password === config.adminPassword) {
                req.session.user = req.user.first_name
                req.session.email = req.user.email
                req.session.roll = req.user.roll
                req.session.admin = true
                req.session.usuario = false
                req.session.premium = false
                req.logger.info('Usted es Admin')
                let last_connection = new Date
                await sessionsService.updateLastConnection(req.user.email, last_connection)
                res.redirect('/')
            } else {
                req.session.user = req.user.first_name
                req.session.email = req.user.email
                req.session.roll = req.user.roll
                req.session.cart = req.user.cart
                req.session.admin = false
                req.session.usuario = req.user.roll === "Premium" ? false : true
                req.session.premium = req.user.roll === "Premium" ? true : false
                req.logger.info('Usted es usuario')
                let last_connection = new Date
                await sessionsService.updateLastConnection(req.user.email, last_connection)
                res.redirect('/')
            }
        } catch (error) {
            req.logger.error(error)
        }
    }

    register = async (req, res)=>{
        try {
            const { first_name, last_name, age, roll = "user", email, password, confirm_password } = req.body;
            
            const userFound = await sessionsService.getUser(email);
            if (userFound) {
                req.flash("error_msg", "The Email is already in use.");
                return res.redirect("/auth/register");
            }
            
            const cart = await mongoCartManager.createCart();
            let newUser = {
                first_name,
                last_name,
                age,
                roll,
                email,
                cart: cart._id,
                password: createHash(password),
              };
            await sessionsService.addUser(newUser);
            req.flash("success_msg", "You are already registered.");
            res.redirect("/auth/login");
        } catch (error) {
            req.logger.error(error)
        }
    }

    logout = async (req, res, next) => {
        try {
            req.session.destroy(err => {
                if(!err) res.redirect('/')
                else res.send({status:'Logout error', message: err})
            })
        } catch (error) {
            req.logger.error(error)
        }
    }

    githubcallback = async (req, res) => {
        req.session.user = req.user.first_name
        req.session.email = req.user.email
        req.session.admin = false
        req.session.usuario = true
        res.redirect('/')
    }
}

export default LoginController