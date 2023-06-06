import { Router } from "express"
import { userVali } from "../middleware/userValidation.js"
import passport from "passport"

const router = Router()


router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/auth/faillogin'}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: 'error', error: 'Credenciales inválidas'})
    const { password } = req.body
    try {
        
        if (req.user.email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = req.user.first_name
            req.session.admin = true
            req.session.usuario = false
            console.log('usted es admin')
            res.redirect('http://localhost:8080/products')
        } else {
            req.session.user = req.user.first_name
            req.session.admin = false
            req.session.usuario = true
            console.log('usted es usuario')
             res.redirect('http://localhost:8080/products')
        }

    } catch (error) {
        console.log(error)
    }
})

router.get('/faillogin', (req, res) => {
    res.send({status: 'error', message: 'Falló el login'})
})


router.post('/register', userVali, passport.authenticate('register', {failureRedirect: '/auth/failregister'}), async (req, res)=>{
    
    try {
        res.redirect('http://localhost:8080/auth/login')
    } catch (error) {
        console.log(error);
    }
})

router.get('/failregister', (req, res) => {
    res.send({status: 'error', message: 'Falló el registro'})
})

router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if(!err) res.redirect('http://localhost:8080/auth/login')
            else res.send({status:'Logout error', message: err})
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/auth/login'}), async (req, res) => {
    req.session.user = req.user.first_name
    req.session.email = req.user.email
    req.session.admin = false
    req.session.usuario = true
    res.redirect('http://localhost:8080/products')
})

export default router