import { Router } from "express"
import { userValidation } from "../middleware/userValidation.js"
import passport from "passport"
import LoginController from "../controllers/loginController.js"
import { authValidation } from "../middleware/auth.js"

const router = Router()

const loginController = new LoginController


router.get('/login', loginController.loginRender)

router.get('/register', loginController.registerRender)

router.post('/login', authValidation, passport.authenticate('login', {failureRedirect: '/auth/faillogin'}), loginController.login)

router.get('/faillogin', loginController.failLoginRender)

router.post('/register', userValidation, loginController.register)

router.get('/failregister', loginController.failRegisterRender)

router.get('/logout', loginController.logout)

router.get('/github', passport.authenticate('github', {scope: ['user:email']}))

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/auth/login'}), loginController.githubcallback)

export default router