import { Router } from "express";
import { auth } from '../middleware/auth.js'
import ViewsController from "../controllers/viewsController.js"
import { rollAdminVerify, rollUserVerify } from "../middleware/rollVerify.js";

const router = Router()

const viewsController = new ViewsController

router.get('/products', auth, viewsController.productsRender)

router.get('/carts/:cid', viewsController.cartsRender)

router.get('/realtimeproducts', rollAdminVerify, viewsController.realTimeProductsRender)

router.get('/messages', rollUserVerify, viewsController.messages)

export default router