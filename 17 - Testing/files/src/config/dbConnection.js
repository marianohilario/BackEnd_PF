import { connect } from "mongoose"
import config from './config.js'
import program from '../../process.js'
import logger from "../ultis/logger.js"

const { mode } = program.opts()
const URL = config.mongoUrl

const dbConnection = async () => {
    return await connect(URL, error => {
        if (error) {
            logger.fatal('No se puede conectar a la base de datos: ' + error);
            process.exit()
        }
        logger.info('Conectado a Mongodb en entorno ' + mode);
    })
}

export default dbConnection