import { config as _config } from "dotenv";
import command from "../../process.js";

const { mode } = command.opts();

_config({
  path: mode === "DEVELOPMENT" ? "./.env.dev" : "./.env.prod",
});

const config = {
  port: process.env.PORT,
  mode,
  persistence: process.env.PERSISTENCE,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtPrivateKey: process.env.JWT_SECRET,
  testMailAdmin: process.env.TEST_MAIL_ADMIN,
  testMailPass: process.env.TEST_MAIL_PASSWORD,
};

export default config;