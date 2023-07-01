import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'
import { validation } from '../middleware/validation.js'
import { rollVerify } from '../middleware/rollVerify.js'

const router = Router()

const productsController = new ProductsController

router.get('/', productsController.getProducts)

router.get('/:pid', productsController.getProductById)

router.post('/', rollVerify, validation, productsController.addProduct)

router.put('/:pid', validation, productsController.updateProduct)

router.delete('/:pid', productsController.delete)

export default router