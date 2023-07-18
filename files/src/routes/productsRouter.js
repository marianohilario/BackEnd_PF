import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'
import { validation } from '../middleware/validation.js'
import { rollAdminVerify, rollPremiumVerify, VerifyRollAdminOrPremium } from '../middleware/rollVerify.js'

const router = Router()

const productsController = new ProductsController

router.get('/', productsController.getProducts)

router.get('/:pid', productsController.getProductById)

router.put('/:pid', validation, productsController.updateProduct)

router.post('/', rollPremiumVerify, validation, productsController.addProduct)

router.delete('/:pid', VerifyRollAdminOrPremium, productsController.delete)

export default router