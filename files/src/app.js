import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import router from "./routes/index.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MongoProductManager } from "./dao/mongo/mongoProductManager.js";
import dbConnection from "./config/database.js";
import chatModel from "./models/messages.js";
import { Server } from "socket.io";
import { initPassport } from "./config/passport.js";
import passport from "passport";
import errorMiddleware from "./middleware/error.js";
import addLogger from "./middleware/logger.js";
import logger from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import methodOverride from "method-override";
import flash from "connect-flash";
import config from "./config/config.js";
import command from "../process.js";

const productManager = new MongoProductManager();

// Initialize
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
dbConnection();

// Settings
app.use(express.json());
app.use(addLogger);
app.set("views", join(__dirname, "views"));
const hbs = handlebars.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".handlebars",
});
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
  })
);
initPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});


// Routes
app.use("/", router);


// Static Files
app.use(express.static(join(__dirname, "public")));


// Server Listenning
const httpServer = app.listen(config.port, (err) => {
  if (err) logger.error(err);
  logger.info(
    `Listening on port ${config.port} in ${command.opts().mode} environment`
  );
});


app.use(errorMiddleware);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación ecommerce curso Backend",
      description:
        "Proyecto desarrollado para el curso de Backend de CoderHouse.",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

httpServer.on;

const socketServer = new Server(httpServer);

let productos;
let mensajes;

socketServer.on("connection", async (socket) => {
  logger.info("Nuevo cliente conectado");
  try {
    productos = await productManager.getProducts();
    mensajes = await chatModel.find();
    socket.emit("mensajeServer", productos);
    socket.emit("mensajesChat", mensajes);
  } catch (error) {
    logger.error(error);
  }

  socket.on("product", async () => {
    await app.use("/api/products", productsRouter);
  });

  socket.on("deleteProduct", async (data) => {
    try {
      await productManager.deleteProduct(data);
      let datos = await productManager.getProducts();
      socketServer.emit("productoEliminado", datos);
    } catch (error) {
      logger.error(error);
    }
  });

  socket.on("msg", async (data) => {
    try {
      await chatModel.insertMany(data);
      let datos = await chatModel.find();
      socketServer.emit("Mensaje", datos);
    } catch (error) {
      logger.error(error);
    }
  });
});
