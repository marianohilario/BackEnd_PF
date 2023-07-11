import { connect } from "mongoose";
import config from "./config.js";
import program from "../../process.js";
import logger from "../utils/logger.js";

const { mode } = program.opts();
const URL = config.mongoUrl;

const dbConnection = async () => {
  try {
    await connect(URL);
    logger.info(`Connected to Mongodb in ${mode} environment`);
  } catch (error) {
    logger.fatal(`Cannot connect to database: ${error}`);
    process.exit();
  }
};

export default dbConnection;
