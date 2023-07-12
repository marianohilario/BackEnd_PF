import CartsService from '../services/cartsService.js'
import ProductsService from '../services/productsService.js'
import TicketService from '../services/ticketService.js'

const cartsService = new CartsService
const productsService = new ProductsService
const ticketService = new TicketService

class CartsController {
    createCart = async (req, res) => {
        try {
            await cartsService.createCart()
            res.status(201).send({mensaje: 'Carrito creado'})
        } catch (error) {
            res.status(200).send({mensaje: 'No se pudo crear el carrito'})
        }
    }

    cartProducts = async (req, res) => {
        const { cid } = req.params
        const {limit = 1 , page = 1, query} = req.query

        try {
            const cartProducts = await cartsService.getCartProducts(cid, limit, page)
            res.status(201).send(cartProducts)
        } catch (error) {
            res.status(200).send({mensaje: 'El carrito no existe'})
        }
    }

    addProduct = async (req, res) => {
        const { cid, pid } = req.params
        const { select } = req.body
        try {
            await cartsService.uploadProduct(cid, pid, select)
            res.status(201).send({mensaje: "Producto agregado al carrito"})
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
        }
    }

    deleteProduct = async (req, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.deleteProduct(cid, pid)
            res.status(201).send({mensaje: "Producto eliminado del carrito"})
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo eliminar el producto del carrito"})
        }
    }

    uploadProduct = async (req, res) => {
        const { cid, pid } = req.params
        const {quantity} = req.body

        try {
            await cartsService.uploadProduct(cid, pid, quantity)
            res.status(201).send({mensaje: "Producto agregado al carrito"})
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
        }
    }

    deleteCartProducts = async (req, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.deleteCartProducts(cid)
            res.status(201).send({mensaje: "Todos los productos fueron eliminados del carrito"})
            
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo eliminar los productos del carrito"})
        }
    }

    arrayProductsUpdate = async (req, res) => {
        const { cid } = req.params
        const data = req.body

        try {
            await cartsService.arrayProductsUpdate(cid, data)
            res.status(201).send({mensaje: "Producto agregado al carrito"})
            
        } catch (error) {
            req.logger.error(error)
            res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
        }
    }

    createTicket = async (req, res) => {
        const { cid } = req.params
        const { limit = 1, page = 1, query } = req.query

        try {
            let sbProducts = []
            let amount = 0

            const cartProducts = await cartsService.getCartProducts(cid, limit, page)
            if(!cartProducts.docs[0].products[0]) return res.status(401).send({status: 'No hay productos en el carrito', error: cartProducts})

            for (const product of cartProducts.docs[0].products) {
                const dbProduct = await productsService.getProductById(product.pid)
                if(product.quantity <= dbProduct.stock) {
                    dbProduct.stock -= product.quantity

                    amount += (dbProduct.price * product.quantity)

                    const { title, description, code, price, status, stock, category, thumbnail} = dbProduct

                    const obj = { title, description, code, price, status, stock, category, thumbnail}

                    await productsService.updateProduct(product.pid, obj)
                
                } else {
                    sbProducts.push(product)
                    req.logger.info(sbProducts)
                }
            }

            if(sbProducts.length == cartProducts.docs[0].products.length) return res.status(401).send({status: 'error', error: sbProducts})

            await cartsService.arrayProductsUpdate(cid, sbProducts)

            let purchase_datetime = new Date()
            let purchaser = req.user.email
            let code = (Math.random() + 1).toString(36).substring(7);
            req.logger.info(`${amount}, ${purchaser}, ${purchase_datetime}`)

            let ticket = await ticketService.createTicket(code, purchase_datetime, amount, purchaser)

            !sbProducts.length ? res.send({ status: 'success', payload: ticket }) : res.send({ status: 'success', payload: ticket, 'Por falta de stock quedan pendientes en el carrito los siguientes productos': sbProducts })

        } catch (error) {
            req.logger.error(error)
        }
    }
}

export default CartsController