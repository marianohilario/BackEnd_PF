import jwt from 'jsonwebtoken'
import config from '../config/config.js';

const JWT_SECRET = config.jwtPrivateKey

export const generateToken = (user) => {
    const token = jwt.sign({user}, JWT_SECRET, {expiresIn: '1h'})
    return token
}

export const authToken = (req, res, next) => {
    // const authHeader = req.headers.authorization
    const authHeader = req.headers['authorization']

    if(!authHeader){
        return res.status(401).json({
            status:'error',
            error: 'No pudo ser autenticado'
        })
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, JWT_SECRET, (error, credential)=>{
        if(error){
            return res.status(403).json({
                status:'error',
                error: 'No se encuentra autorizado'
            })
        }
        req.credential = credential.user
        next()
    })
}