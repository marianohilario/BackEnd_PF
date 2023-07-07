import { request } from 'express'
import ProductsService from '../services/productsService.js'
import CustomError from '../errors/customError.js'

const productsService = new ProductsService

class ProductsController {
    getProducts = async (req = request, res) => {
      const { limit, page = 1, sort = "desc" } = req.query
    
      try {
        let data = await productsService.getProducts(limit)
        res.send(data.docs)
      } catch (error) {
          req.logger.error(error)
      }
    }

    getProductById = async (req = request, res) => {
      const { pid } = req.params
    
      try {
        const allProducts = await productsService.getProducts()
        const productById = await productsService.getProductById(pid)
    
        pid ? res.send(productById) : res.send(allProducts)
      } catch (error) {
          req.logger.error(error)
      }
    }

    addProduct = async (req = request, res) => {
      const newItem = req.body
      newItem.status = true
      newItem.owner = req.user.roll === "Admin" ? "Admin" : req.session.email
      
      try {
        await productsService.addProduct(newItem)
        res.send({mensaje: 'Producto agregado'})
      } catch (error) {
          req.logger.error(error)
      }
    }

    updateProduct = async (req = request, res) => {
      const { pid } = req.params
      const newItem = req.body
    
      const prod = newItem
      try {
        await productsService.updateProduct(pid, prod)
        res.send({mensaje: 'Producto actualizado'})
      } catch (error) {
          req.logger.error(error)
      }
    }

    delete = async (req = request, res) => {
      const { pid } = req.params
      try {
        let product = await productsService.getProductById(pid)
        if (!product) {
            return res.status(401).send({mensaje: 'Producto no encontrado en la Base de Datos'})
        } else {
            await productsService.deleteProduct(pid)
            res.send({mensaje: 'Producto eliminado'})
        }
      } catch (error) {
          req.logger.error(error)
      }
    }
}

export default ProductsController