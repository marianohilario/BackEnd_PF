import { MongoProductManager } from '../dao/mongo/mongoProductManager.js'
import CartsService from '../services/cartsService.js'
import ProductsService from '../services/productsService.js'
import TicketService from '../services/ticketService.js'

const cartsService = new CartsService
const productsService = new ProductsService
const mongoProductManager = new MongoProductManager
const ticketService = new TicketService

class CartsController {
    createCart = async (req, res) => {
        try {
            await cartsService.createCart()
            res.status(201).send({mensaje: 'Created cart'})
        } catch (error) {
            res.status(200).send({mensaje: 'Could not create cart'})
        }
    }

    cartProducts = async (req, res) => {
        const { cid } = req.params
        const {limit = 1 , page = 1, query} = req.query
        let array = []
        let amount = 0
        let cartItems = 0
        try {
            const cartProducts = await cartsService.cartProducts(cid, limit, page)
            const cart = cartProducts.docs[0].id
            if (cartProducts.docs[0].products.length === 0) {
                let datos = {
                    amount: 0,
                    cartItems: 0,
                    cart
                }
                res.status(201).render('carts', datos)
            } else {
                for (const product of cartProducts.docs[0].products) {
                    const pid = product.pid
                    const dbProduct = await mongoProductManager.getProductById(pid)
                    const { title, description, code, price, status, stock, category, thumbnail, owner } = dbProduct
    
                    const newObject = { pid, title, description, code, price, status, stock, category, thumbnail, owner }
                    
                    newObject.quantity =  product.quantity
                    newObject.subTotal =  product.quantity * newObject.price
                    amount = amount + newObject.subTotal
                    cartItems = cartItems + newObject.quantity
                    newObject.subTotal =  newObject.subTotal.toLocaleString("es-AR");
                    newObject.price = newObject.price.toLocaleString("es-AR");
    
                    array.push(newObject)
                }
                let datos = {
                    productos : array,
                    amount: amount.toLocaleString("es-AR"),
                    cartItems,
                    cart
                }
                res.status(201).render('carts', datos)
            }
            
        } catch (error) {
            res.status(200).send({mensaje: 'The cart does not exist'})
        }

    }

    addProduct = async (req, res) => {
        const { cid, pid } = req.params
        const { select } = req.body
        try {
            await cartsService.uploadProduct(cid, pid, select)
            res.status(201).redirect('/')
        } catch (error) {
            res.status(200).send({mensaje: "Could not add product to cart"})
        }
    }

    deleteProduct = async (req, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.deleteProduct(cid, pid)
            res.status(201).redirect(`/api/carts/${cid}`)
        } catch (error) {
            res.status(200).send({mensaje: "Could not remove product from cart"})
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
            let exceededStock = []
            let amount = 0

            const cartProducts = await cartsService.cartProducts(cid, limit, page)
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
                    exceededStock.push(product)
                    req.logger.info(exceededStock)
                }
            }

            if(exceededStock.length == cartProducts.docs[0].products.length) return res.status(401).send({status: 'error', error: exceededStock})

            await cartsService.arrayProductsUpdate(cid, exceededStock)

            let purchase_datetime = new Date()
            let purchaser = req.user.email
            let code = (Math.random() + 1).toString(36).substring(7);
            req.logger.info(`${amount}, ${purchaser}, ${purchase_datetime}`)

            let ticket = await ticketService.createTicket(code, purchase_datetime, amount, purchaser)

            !exceededStock.length ? res.send({ status: 'success', payload: ticket }) : res.send({ status: 'success', payload: ticket, 'Por falta de stock quedan pendientes en el carrito los siguientes productos': exceededStock })

        } catch (error) {
            req.logger.error(error)
        }
    }
}

export default CartsController