import { request } from "express";
import { createTransport } from 'nodemailer'
import config from '../config/config.js';
import { generateToken } from "../ultis/jwt.js";
import SessionsService from "../services/sessionsService.js";
import logger from "../ultis/logger.js";

const sessionsService = new SessionsService

export class MailController {
    mailRender = async (req = request, res) => {
        res.render('mail')
    }

    sendMail = async (req = request, res) => {
        const {email} = req.body
        try {
            let user = await sessionsService.getUser(email)

            if (!user) res.send({
                status: '401', 
                message: 'El usuario no existe'
            })

            let token = generateToken(user)

            const transport = createTransport({
                service: 'gmail',
                port: 578,
                auth: {
                    user: config.testMailAdmin,
                    pass: config.testMailPass
                }
            })

            let result = await transport.sendMail({
                from:`Ecommerce - Recuperación de Pass <${config.testMailAdmin}>`,
                to: email,
                subject: 'Recuperar contraseña',
                html: `
                <div>
                    <h1>Ecommerce - Curso Backend CoderHouse</h1>
                    <h4>Click en el enlace para restablecer contraseña</h4>
                    <a href="http://localhost:8080/api/users/changePassword/${token}">Restablecer Contraseña</a>
                    </div>`
            })
    
            res.send({status: 'success', payload: 'Correo de recuperación enviado satisfactoriamente'})
        } catch (error) {
            logger.error(error)
        }
    }
}