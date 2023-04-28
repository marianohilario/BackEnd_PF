import { Router } from 'express'
import { MongoCartManager } from '../dao/mongo/mongoCartManager.js'

const router = Router()

const mongoCartManager = new MongoCartManager

router.post('/', async (req, res) => {
  try {
    await mongoCartManager.createCart()
    res.status(201).send({mensaje: 'Carrito creado'})
  } catch (error) {
    res.status(200).send({mensaje: 'No se pudo crear el carrito'})
  }
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  const {limit = 1 , page = 1, query} = req.query

  try {
    const cartProducts = await mongoCartManager.getCartProducts(cid, limit, page)
      res.status(201).send(cartProducts)
  } catch (error) {
    res.status(200).send({mensaje: 'El carrito no existe'})
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  try {
    await mongoCartManager.uploadProduct(cid, pid)
    // res.send(201).send({mensaje: 'Producto agregado al carrito'})
    res.sendStatus(201)
  } catch (error) {
    // res.send(200).send({mensaje: 'No se pudo agregar el producto al carrito'});
    res.sendStatus(200)
  }
})

router.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
      await mongoCartManager.deleteProduct(cid, pid)
      res.status(201).send({mensaje: "Producto eliminado del carrito"})
    } catch (error) {
      res.status(200).send({mensaje: "No se pudo eliminar el producto del carrito"})
  }
})

router.put('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const {quantity} = req.body

  try {
      await mongoCartManager.uploadProduct(cid, pid, quantity)
      res.status(201).send({mensaje: "Producto agregado al carrito"})
    } catch (error) {
      res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
  }
})

router.delete('/:cid', async (req, res) => {
  const { cid, pid } = req.params

  try {
      await mongoCartManager.deleteCartProducts(cid)
      res.status(201).send({mensaje: "Todos los productos eliminados del carrito"})
      
    } catch (error) {
      res.status(200).send({mensaje: "No se pudo eliminar los productos del carrito"})
  }
})

router.put('/:cid', async (req, res) => {
  const { cid } = req.params
  const data = req.body

  try {
      await mongoCartManager.arrayProductsUpdate(cid, data)
      res.status(201).send({mensaje: "Producto agregado al carrito"})
      
    } catch (error) {
      console.log(error)
      res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
  }
})

export default router