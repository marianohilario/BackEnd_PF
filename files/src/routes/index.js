import { Router } from 'express';
import viewsRouter from './viewsRouter.js';
import productsRouter from './productsRouter.js';
import cartsRouter from './cartsRouter.js';
import usersRouter from './userRouter.js';
import sessionsRouter from './sessionsRouter.js';
import mailRouter from './mailRouter.js';
import loggerRouter from './loggerRouter.js';
import loginRouter from './loginRouter.js';
import mockingRouter from './mockingRouter.js';
//import chatRouter from './chatRouter.js';

const router = Router();

router.use("/", viewsRouter);
router.use("/auth", loginRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/users", usersRouter);
router.use("/api/mail", mailRouter);
router.use("/mockingproducts", mockingRouter);
router.use("/loggerTest", loggerRouter);
//router.use("/api/chat", chatRouter);

export default router;