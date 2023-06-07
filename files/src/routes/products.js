import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'

const router = Router()

const productsController = new ProductsController

router.get('/', productsController.getProducts)

router.get('/:pid', productsController.getProductById)

router.post('/', productsController.addProduct)

router.put('/:pid', productsController.updateProduct)

router.delete('/:pid', productsController.delete)

export default router