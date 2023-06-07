import { request } from 'express'
import ProductsService from '../services/productsService.js'

const productsService = new ProductsService

class ProductsController {
    getProducts = async (req = request, res) => {
      const { limit, page = 1, sort = "desc" } = req.query
    
      try {
        let data = await productsService.getProducts(limit)
        res.send(data.docs)
      } catch (error) {
        console.log(error);
      }
    }

    getProductById = async (req = request, res) => {
      const { pid } = req.params
    
      try {
        const allProducts = await productsService.getProducts()
        const productById = await productsService.getProductById(pid)
    
        pid ? res.send(productById) : res.send(allProducts)
      } catch (error) {
        console.log(error);
      }
    }

    addProduct = async (req = request, res) => {
      const newItem = req.body
      newItem.status = true
      if (newItem.title || newItem.description || newItem.price || newItem.thumbnail || newItem.code || newItem.stock || newItem.category)  {
        try {
          await productsService.addProduct(newItem)
          res.send({mensaje: 'Producto agregado'})
        } catch (error) {
        console.log(error);
        }
      } else {
        return res.send({mensaje: 'Debe completar todos los campos'})
      }
    }

    updateProduct = async (req = request, res) => {
      const { pid } = req.params
      const newItem = req.body
    
      if (newItem.title || newItem.description || newItem.price || newItem.thumbnail || newItem.code || newItem.stock || newItem.category)  {
        const prod = newItem
        try {
          await productsService.updateProduct(pid, prod)
          res.send({mensaje: 'Producto actualizado'})
        } catch (error) {
          console.log(error);
        }
      } else {
        res.send({alerta: 'No puede dejar campos sin completar'})
      }
    }

    delete = async (req = request, res) => {
      const { pid } = req.params
    
      try {
        await productsService.deleteProduct(pid)
        res.send({mensaje: 'Producto eliminado'})
      } catch (error) {
        console.log(error);
      }
    }
}

export default ProductsController