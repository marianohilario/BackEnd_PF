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
                if (!user.documents || user.documents.length < 3) {
                    return res.status(400).send({
                        status: 'error',
                        error: `No ha terminado de procesar su documentación, le falta cargar ${3 - user.documents.length} ${3 - user.documents.length > 1 ? 'documentos' : 'documento'}.`
                    })
                }
                
            }
            let newUser = await sessionsService.updateRoll(user.email, `${user.roll === 'premium' ? 'user' : 'premium'}`)
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

    documentsRender = (req = request, res) => {
        res.render('profile')
    }

    uploadDocuments = async (req = request, res) => {
        const file = req.files
        if (file[0].fieldname === 'documents') {
            try {
                const {uid} = req.params
                if (!file) res.status(400).send({status: error, error: "No se pudo guardar la imagen"})
                
                let userData = await sessionsService.getUserById(uid)
                if (!userData) res.status(404).send({error: 'Usuario no encontrado'})
                
                userData.documents = userData.documents || []
                
                file.forEach((file) => {
                    userData.documents.push({
                        name: file.filename,
                        reference: file.destination
                    })
                })
                
                let user = await sessionsService.uploadDocument(uid, userData.documents)
                    res.send({status: 'ok', link: req.files.path, user})
            } catch (error) {
                logger.error(error)
            }
        } else {
            res.send({message: 'Image uploaded successfully'})
        }
    }
}

export default UserController