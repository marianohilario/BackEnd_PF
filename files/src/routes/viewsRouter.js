import { Router } from "express";
import ViewsController from "../controllers/viewsController.js"
import { VerifyRollAdminOrPremium, userLogged } from "../middleware/rollVerify.js";

const router = Router()

const viewsController = new ViewsController

router.get('/', viewsController.productsRender)

router.get('/realtimeproducts', VerifyRollAdminOrPremium, viewsController.realTimeProductsRender)

router.get('/messages', userLogged, viewsController.messages)

export default router