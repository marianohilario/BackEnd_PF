import jwt from 'jsonwebtoken'
import { request } from "express"
import { createHash, isValidPassword } from "../ultis/bcryptPass.js"
import SessionsService from "../services/sessionsService.js"
import config from '../config/config.js';
import logger from '../ultis/logger.js';

const sessionsService = new SessionsService

class UserController{
    rollSwitch = async (req = request, res) => {
        const {uid} = req.params

        try {
            let user = await sessionsService.getUserById(uid)

            if (!user) {
                res.send({
                    status: 'error', 
                    message: 'El usuario no existe'
                })
            } else {
                req.session.premium = !req.session.premium
                let newUser = await sessionsService.updateRoll(user.email, `${req.session.premium ? 'user' : 'premium'}`)
                res.send({status: 'success', data: newUser})
            }
            
        } catch (error) {
            logger.error(error)
        }
    }

    changePassword = async (req = request, res) => {
        const { email, password } = req.body

        try {
            let user = await sessionsService.getUser(email)

            if (isValidPassword(user, password)) {
                res.send('No puede repetir la contraseña anterior')
            } else {
                await sessionsService.updateUser(email, createHash(password))
                res.send('Contraseña restablecida')
            }
        } catch (error) {
            logger.error(error)
        }
    }

    renderChangePassword = async (req = request, res) => {
        const {token} = req.params
        try {
            jwt.verify(token, config.jwtPrivateKey, (error)=>{
                if(error){
                    res.redirect('http://localhost:8080/api/mail')
                }
                res.render('changePassword')
            })
        } catch (error) {
            logger.error(error)
        }
    }
}

export default UserController