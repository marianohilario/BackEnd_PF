import { Router } from "express";
import { auth } from '../middleware/auth.js'
import ViewsController from "../controllers/viewsController.js"

const router = Router()

const viewsController = new ViewsController

router.get('/products', auth, viewsController.productsRender)

router.get('/carts/:cid', viewsController.cartsRender)

router.get('/realtimeproducts', viewsController.realTimeProductsRender)

router.get('/messages', viewsController.messages)

export default router