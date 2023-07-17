import { Router } from "express";
import { auth } from '../middleware/auth.js'
import ViewsController from "../controllers/viewsController.js"
import { rollAminVerify, userLogged } from "../middleware/rollVerify.js";

const router = Router()

const viewsController = new ViewsController

router.get('/', viewsController.productsRender)

//router.get('/carts/:cid', viewsController.cartsRender)

router.get('/realtimeproducts', viewsController.realTimeProductsRender)
//router.get('/realtimeproducts', rollVerify, viewsController.realTimeProductsRender)

router.get('/messages', userLogged, viewsController.messages)

export default router