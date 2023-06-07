import { request } from 'express'
import SessionsService from '../services/sessionsService.js'

const sessionsService = new SessionsService

class SessionsController {
    current = async (req = request, res) =>{

        try {
            let user = await sessionsService.getUser(req.user.email)
            console.log(user)
            res.send(user)
        } catch (error) {
            console.log(error)
        }
    }
}

export default SessionsController