import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import loginRouter from "./routes/login.js";
import sessionsRouter from "./routes/sessions.js"
import mockingRouter from './routes/mocking.js'
import loggerRouter from './routes/logger.js'
import __dirname from "./utils.js";
import { MongoProductManager } from "./dao/mongo/mongoProductManager.js";
import dbConnection from "./config/dbConnection.js";
import chatModel from "./models/messages.js";
import { Server } from "socket.io";
import { initPassport } from "./config/passport.js";
import passport from "passport";
import errorMiddleware from './middleware/error.js'
import addLogger from "./middleware/logger.js";
import logger from "./ultis/logger.js";

const app = express();
const PORT = 8080;

dbConnection();

const productManager = new MongoProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secretCoder',
    resave: false,
    saveUninitialized: false
}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(errorMiddleware)
app.use(addLogger)

app.use("/public", express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use('/auth', loginRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter)
app.use("/mockingproducts", mockingRouter)
app.use('/loggerTest', loggerRouter)

const httpServer = app.listen(PORT, (err) => {
  if (err) logger.error(err);
  logger.info("Escuchando puerto: " + PORT);
});

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
    app.use("/api/products", productsRouter)
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
