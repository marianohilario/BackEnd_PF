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
            } 
            if (user.roll === 'user') {
                //let user = await userService.getUser(uemail)
                let identificacion = user.documents.find(document => document.name == 'Identificacion')
                let comprobanteDomicilio = user.documents.find(document => document.name == 'Comprobante de domicilio')
                let comprobanteEstadoCuenta = user.documents.find(document => document.name == 'Comprobante de estado de cuenta')
                if (!identificacion || !comprobanteDomicilio || !comprobanteEstadoCuenta) res.send({status: 'error', message: 'No ha terminado de procesar su documentación'})
            }

            let newUser = await sessionsService.updateRoll(user.email, `${req.session.premium ? 'user' : 'premium'}`)
            res.send({status: 'success', data: newUser})
            
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

    uploadDocument = async (req = request, res) => {
        const {name} = req.body
        console.log(req.body);
        const {uid} = req.params
        try {
            if (!req.file) res.status(400).send({status: error, error: "No se pudo guardar la imagen"})
            
            let userData = await sessionsService.getUserById(uid)
            console.log('userData: ', userData)
            if (!userData.documents || userData.documents == []) {
                let user = await sessionsService.uploadDocument(uid, [{name, reference: req.file.path}])
                res.send({status: 'ok', link: req.file.path, user})
            }
            let documents = userData.documents
            documents.push({name, reference: req.file.path})
            console.log('documents: ', documents)
            let user = await sessionsService.uploadDocument(uid, documents)
            res.send({status: 'ok', link: req.file.path, user})
        } catch (error) {
            console.log(error)
        }
    }
}

export default UserController