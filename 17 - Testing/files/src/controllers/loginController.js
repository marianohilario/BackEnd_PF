import { request } from 'express'
import config from '../config/config.js'

class LoginController {
    loginRender = (req = request, res) => {
        res.render('login')
    }

    registerRender = (req = request, res) => {
        res.render('register')
    }

    failLoginRender = (req = request, res) => {
        res.send({status: 'Error', msg: 'Falló el login'})
    }

    failRegisterRender = (req = request, res) => {
        res.send({status: 'Error', msg: 'Falló el registro'})
    }

    loginVoid = async (req = request, res) => {
        if(!req.user) return res.status(400).send({status: 'error', error: 'Credenciales inválidas'})
        const { password } = req.body
        try {
            
            if (req.user.email === config.adminName && password === config.adminPassword) {
                req.session.user = req.user.first_name
                req.session.email = req.user.email
                req.session.roll = req.user.roll
                req.session.admin = true
                req.session.usuario = false
                req.logger.info('Usted es admin')
                res.redirect('http://localhost:8080/products')
            } else {
                req.session.user = req.user.first_name
                req.session.email = req.user.email
                req.session.roll = req.user.roll
                req.session.cart = req.user.cart
                req.session.admin = false
                req.session.usuario = true
                req.logger.info('Usted es usuario')
                res.redirect('http://localhost:8080/products')
            }
        } catch (error) {
            req.logger.error(error)
        }
    }

    registerVoid = async (req = request, res)=>{
        try {
            res.redirect('http://localhost:8080/auth/login')
        } catch (error) {
            req.logger.error(error)
        }
    }

    logOutVoid = async (req = request, res) => {
        try {
            req.session.destroy(err => {
                if(!err) res.redirect('http://localhost:8080/auth/login')
                else res.send({status:'Logout error', message: err})
            })
        } catch (error) {
            req.logger.error(error)
        }
    }

    githubcallback = async (req = request, res) => {
        req.session.user = req.user.first_name
        req.session.email = req.user.email
        req.session.admin = false
        req.session.usuario = true
        res.redirect('http://localhost:8080/products')
    }
}

export default LoginController