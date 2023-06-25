import logger from "../ultis/logger.js";

const addLogger = (req, res, next) => {
    req.logger = logger
    next()
}

export default addLogger