import { Router } from 'express'
import CartsController from '../controllers/cartsController.js'
import { rollUserVerify } from '../middleware/rollVerify.js'
import productIdValidation from '../middleware/productValidation.js'

const router = Router()

const cartsController = new CartsController

router.post('/', cartsController.createCart)

router.get('/:cid', cartsController.getCartProducts)

router.post('/:cid/product/:pid', productIdValidation, rollUserVerify, cartsController.newProduct)

router.delete('/:cid/product/:pid', rollUserVerify, cartsController.deleteProduct)

router.put('/:cid/product/:pid', cartsController.uploadProduct)

router.delete('/:cid', cartsController.deleteCartProducts)

router.put('/:cid', cartsController.arrayProductsUpdate)

router.get('/:cid/purchase', rollUserVerify, cartsController.createTicket)

export default router