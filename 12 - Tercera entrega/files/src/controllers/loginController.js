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
                req.session.admin = true
                req.session.usuario = false
                console.log('usted es admin')
                res.redirect('http://localhost:8080/products')
            } else {
                req.session.user = req.user.first_name
                req.session.email = req.user.email
                req.session.cart = req.user.cart
                req.session.admin = false
                req.session.usuario = true
                console.log('usted es usuario')
                 res.redirect('http://localhost:8080/products')
            }
    
        } catch (error) {
            console.log(error)
        }
    }

    registerVoid = async (req = request, res)=>{
        try {
            res.redirect('http://localhost:8080/auth/login')
        } catch (error) {
            console.log(error);
        }
    }

    logOutVoid = async (req = request, res) => {
        try {
            req.session.destroy(err => {
                if(!err) res.redirect('http://localhost:8080/auth/login')
                else res.send({status:'Logout error', message: err})
            })
        } catch (error) {
            console.log(error)
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