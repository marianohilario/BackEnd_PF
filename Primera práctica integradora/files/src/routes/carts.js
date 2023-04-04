import { Router } from 'express'
import { MongoCartManager } from '../dao/mongo/mongoCartManager.js'

const router = Router()

const mongoCartManager = new MongoCartManager

router.post('/', async (req, res) => {
  await mongoCartManager.createCart()
  res.send({mensaje: 'Carrito creado'})
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const cartProducts = await mongoCartManager.getCartProducts(cid)
      res.send(cartProducts)
  } catch (error) {
    console.log(error);
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    await mongoCartManager.uploadProduct(cid, pid)
    res.send({mensaje: 'Producto agregado al carrito'})
  } catch (error) {
    console.log(error);
  }
})

export default router