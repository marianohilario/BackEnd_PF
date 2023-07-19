import { Router } from "express"
import { userValidation } from "../middleware/userValidation.js"
import passport from "passport"
import LoginController from "../controllers/loginController.js"
import { authValidation } from "../middleware/auth.js"

const router = Router()

const loginController = new LoginController

// Render login form
router.get('/login', loginController.loginRender)

// Validate login
router.post('/login', authValidation, passport.authenticate('login', {failureRedirect: '/auth/faillogin'}), loginController.login)

// Error login
router.get('/faillogin', loginController.failLoginRender)

// Render register form
router.get('/register', loginController.registerRender)

// Register user in database
router.post('/register', userValidation, loginController.register)

// Error register
router.get('/failregister', loginController.failRegisterRender)

// Logout
router.get('/logout', loginController.logout)

// Github authenticate
router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/auth/login'}), loginController.githubcallback)

export default router