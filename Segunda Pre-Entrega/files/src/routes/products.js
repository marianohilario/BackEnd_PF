import { Router } from 'express'
import { MongoProductManager } from '../dao/mongo/mongoProductManager.js'

const router = Router()

const mongoProductManager = new MongoProductManager()

router.get('/', async (req, res) => {
  const { limit, page = 1, sort = "desc" } = req.query

  try {
    let data = await mongoProductManager.getProducts(limit)
    res.send(data.docs)
  } catch (error) {
    console.log(error);
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    const allProducts = await mongoProductManager.getProducts()
    const productById = await mongoProductManager.getProductById(pid)

    pid ? res.send(productById) : res.send(allProducts)
  } catch (error) {
    console.log(error);
  }
})

router.post('/', async (req, res) => {
  const newItem = req.body
  newItem.status = true
  if (newItem.title || newItem.description || newItem.price || newItem.thumbnail || newItem.code || newItem.stock || newItem.category)  {
    try {
      await mongoProductManager.addProduct(newItem)
      res.send({mensaje: 'Producto agregado'})
    } catch (error) {
    console.log(error);
    }
  } else {
    return res.send({mensaje: 'Debe completar todos los campos'})
  }
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  const newItem = req.body

  if (newItem.title || newItem.description || newItem.price || newItem.thumbnail || newItem.code || newItem.stock || newItem.category)  {
    const prod = newItem
    try {
      await mongoProductManager.updateProduct(pid, prod)
      res.send({mensaje: 'Producto actualizado'})
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send({alerta: 'No puede dejar campos sin completar'})
  }
})

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    await mongoProductManager.deleteProduct(pid)
    res.send({mensaje: 'Producto eliminado'})
  } catch (error) {
    console.log(error);
  }
})

export default router