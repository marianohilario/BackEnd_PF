import logger from "../utils/logger.js";

const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};

export default addLogger;
