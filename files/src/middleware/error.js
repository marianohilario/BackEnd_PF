import EErrors from "../errors/enum.js";
import logger from "../utils/logger.js";

export default (error, req, res, next) => {
  logger.error(error.cause);
  switch (error.code) {
    case EErrors.INVALID_PROPERTIES:
      res.send({ status: "error", error: error.name });
      break;

    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
