import winston from 'winston'
import program from '../../process.js'

const { mode } = program.opts()

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    }
}

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({level: 'debug'})
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({level: 'info'}),
        new winston.transports.File({filename: './logs/errors.log', level: 'error'})
    ]
})

const logger = mode === "DEVELOPMENT" ? devLogger : prodLogger

export default logger