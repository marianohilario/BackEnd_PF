import { Router } from 'express'
import CartsController from '../controllers/cartsController.js'
import { rollUserVerify, rollPremiumVerify } from '../middleware/rollVerify.js'
import productIdValidation from '../middleware/productValidation.js'

const router = Router()

const cartsController = new CartsController

router.post('/', cartsController.createCart)

router.get('/:cid', cartsController.getCartProducts)

router.post('/:cid/product/:pid', cartsController.newProduct) //Habilitado sólo para testear, luego eliminar y habilitar la línea de abajo.
//router.post('/:cid/product/:pid', productIdValidation, rollPremiumVerify, rollUserVerify, cartsController.newProduct)

router.delete('/:cid/product/:pid', cartsController.deleteProduct) //Habilitado sólo para testear, luego eliminar y habilitar la línea de abajo.
//router.delete('/:cid/product/:pid', rollUserVerify, cartsController.deleteProduct)

router.put('/:cid/product/:pid', cartsController.uploadProduct)

router.delete('/:cid', cartsController.deleteCartProducts)

router.put('/:cid', cartsController.arrayProductsUpdate)

router.get('/:cid/purchase', rollUserVerify, cartsController.createTicket)

export default router