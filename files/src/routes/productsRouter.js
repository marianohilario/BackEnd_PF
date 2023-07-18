import { Router } from 'express'
import ProductsController from '../controllers/productsController.js'
import { validation } from '../middleware/validation.js'
import { rollAdminVerify, VerifyRollAdminOrPremium } from '../middleware/rollVerify.js'

const router = Router()

const productsController = new ProductsController

// Product Manager render
router.get('/', rollAdminVerify, productsController.getProducts)

// Edit product render
router.get('/:pid', VerifyRollAdminOrPremium, productsController.getProductById)

// Edit product
router.put('/:pid',VerifyRollAdminOrPremium, validation, productsController.updateProduct)

// Add products to data base
router.post('/', VerifyRollAdminOrPremium, validation, productsController.addProduct)

// Delete products
router.delete('/:pid', VerifyRollAdminOrPremium, productsController.delete)

export default router