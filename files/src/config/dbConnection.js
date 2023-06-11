import { connect } from "mongoose"
import config from './config.js'

const URL = config.mongoUrl

const dbConnection = async () => {
    return await connect(URL, error => {
        if (error) {
            console.log('No se puede conectar a la base de datos: ' + error);
            process.exit()
        }
        console.log('Conectado a Mongodb');
    })
}

export default dbConnection