import { request } from 'express'
import CartsService from '../services/cartsService.js'

const cartsService = new CartsService

class CartsController {
    createCart = async (req = request, res) => {
        try {
            await cartsService.createCart()
            res.status(201).send({mensaje: 'Carrito creado'})
        } catch (error) {
            res.status(200).send({mensaje: 'No se pudo crear el carrito'})
        }
    }

    getCartProducts = async (req = request, res) => {
        const { cid } = req.params
        const {limit = 1 , page = 1, query} = req.query

        try {
            const cartProducts = await cartsService.getCartProducts(cid, limit, page)
            res.status(201).send(cartProducts)
        } catch (error) {
            res.status(200).send({mensaje: 'El carrito no existe'})
        }
    }

    newProduct = async (req = request, res) => {
        const { cid, pid } = req.params
        try {
            await cartsService.uploadProduct(cid, pid)
            res.sendStatus(201)
        } catch (error) {
            res.sendStatus(200)
        }
    }

    deleteProduct = async (req = request, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.deleteProduct(cid, pid)
            res.status(201).send({mensaje: "Producto eliminado del carrito"})
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo eliminar el producto del carrito"})
        }
    }

    uploadProduct = async (req = request, res) => {
        const { cid, pid } = req.params
        const {quantity} = req.body

        try {
            await cartsService.uploadProduct(cid, pid, quantity)
            res.status(201).send({mensaje: "Producto agregado al carrito"})
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
        }
    }

    deleteCartProducts = async (req = request, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.deleteCartProducts(cid)
            res.status(201).send({mensaje: "Todos los productos eliminados del carrito"})
            
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo eliminar los productos del carrito"})
        }
    }

    arrayProductsUpdate = async (req = request, res) => {
        const { cid } = req.params
        const data = req.body

        try {
            await cartsService.arrayProductsUpdate(cid, data)
            res.status(201).send({mensaje: "Producto agregado al carrito"})
            
        } catch (error) {
            console.log(error)
            res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
        }
    }
}

export default CartsController