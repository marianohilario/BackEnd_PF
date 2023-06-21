import { request } from 'express'
import SessionsService from '../services/sessionsService.js'

const sessionsService = new SessionsService

class SessionsController {
    current = async (req = request, res) =>{

        try {
            let email = req.user.email
            let user = await sessionsService.getUser(email)
            res.send(user)
        } catch (error) {
            console.log(error)
        }
    }
}

export default SessionsController