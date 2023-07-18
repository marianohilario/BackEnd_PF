import { Router } from 'express'
import CartsController from '../controllers/cartsController.js'
import { userLogged, rollPremiumVerify } from '../middleware/rollVerify.js'

const router = Router()

const cartsController = new CartsController

// Create Cart
router.post('/', cartsController.createCart)

// Render Cart
router.get('/:cid', userLogged, cartsController.cartProducts)

// Add Products to Cart
router.post('/:cid/product/:pid', userLogged, cartsController.addProduct)
//router.post('/:cid/product/:pid', cartsController.addProduct) //Habilitado sólo para testear, luego eliminar y habilitar la línea de arriba.

// Remove Product from Cart
router.delete('/:cid/product/:pid', userLogged, cartsController.deleteProduct)
//router.delete('/:cid/product/:pid', cartsController.deleteProduct) //Habilitado sólo para testear, luego eliminar y habilitar la línea de arriba.

// Clear Cart
router.delete('/:cid', userLogged, cartsController.clearCart)

// Create Purchase Ticket
router.get('/:cid/purchase', userLogged, cartsController.purchaseTicket)




router.put('/:cid/product/:pid', cartsController.uploadProduct)

router.put('/:cid', cartsController.cartProductsUpdate)


export default router