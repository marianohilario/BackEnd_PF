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
        let productos = []
        let amount = 0
        let cartItems = 0
        try {
            const cartProducts = await cartsService.cartProducts(cid, limit, page)
            console.log(cartProducts);
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
    
                    productos.push(newObject)
                }
                let datos = {
                    productos,
                    amount: amount.toLocaleString("es-AR"),
                    cartItems,
                    cart,
                    username: req.session.user,
                    uid: req.user?._id.toHexString(),
                    AdminUser: req.session.admin,
                    PremiumUser: req.session.premium,
                }
                res.status(201).render('carts', datos)
            }
            
        } catch (error) {
            res.status(200).send({mensaje: 'Cart does not exist'})
        }

    }

    addProduct = async (req, res) => {
        const { cid, pid } = req.params
        const { select } = req.body
        try {
            await cartsService.uploadProduct(cid, pid, select)
            req.flash('success_msg', 'Product added successfully')
            res.status(201).redirect('/')
        } catch (error) {
            res.status(200).send({mensaje: "Could not add product to cart"})
        }
    }

    deleteProduct = async (req, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.deleteProduct(cid, pid)
            req.flash('success_msg', 'Product removed successfully')
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

    clearCart = async (req, res) => {
        const { cid, pid } = req.params

        try {
            await cartsService.clearCart(cid)
            res.status(201).redirect(`/api/carts/${cid}`)
            
        } catch (error) {
            res.status(200).send({mensaje: "No se pudo eliminar los productos del carrito"})
        }
    }

    cartProductsUpdate = async (req, res) => {
        const { cid } = req.params
        const data = req.body

        try {
            await cartsService.cartProductsUpdate(cid, data)
            res.status(201).send({mensaje: "Producto agregado al carrito"})
            
        } catch (error) {
            req.logger.error(error)
            res.status(200).send({mensaje: "No se pudo agregar el producto al carrito"})
        }
    }


    purchaseTicket = async (req, res) => {
        const { cid } = req.params
        const { limit = 1, page = 1, query } = req.query

        try {
            let exceededStock = []
            let leftInCart = []
            let amount = 0
            let purchaseAmount = 0
            let cartItems = 0

            const cartProducts = await cartsService.cartProducts(cid, limit, page)
            const cart = cartProducts.docs[0].id
            if(!cartProducts.docs[0].products[0]) {
                req.flash('error_msg', 'There are no products in the cart')
                return res.status(401).redirect(`/api/carts/${cid}`)
            }

            for (const product of cartProducts.docs[0].products) {
                const dbProduct = await productsService.getProductById(product.pid)
                if(product.quantity <= dbProduct.stock) {
                    dbProduct.stock -= product.quantity
                    purchaseAmount += (dbProduct.price * product.quantity)
                    const { title, description, code, price, status, stock, category, thumbnail} = dbProduct
                    const prodToUpdate = { title, description, code, price, status, stock, category, thumbnail}
                    await productsService.updateProduct(product.pid, prodToUpdate)
                } else {
                    const { title, description, code, price, status, stock, category, thumbnail} = dbProduct
                    const newObject = { title, description, code, price, status, stock, category, thumbnail}
                    newObject.pid = product.pid
                    newObject.quantity =  product.quantity
                    newObject.subTotal =  product.quantity * newObject.price
                    amount = amount + newObject.subTotal
                    cartItems = cartItems + newObject.quantity
                    newObject.subTotal =  newObject.subTotal.toLocaleString("es-AR");
                    newObject.price = newObject.price.toLocaleString("es-AR");
                    exceededStock.push(newObject)
                    leftInCart.push(product)
                }
            }

            //if(exceededStock.length === cartProducts.docs[0].products.length) return res.status(401).send({status: 'error', error: exceededStock})

            await cartsService.cartProductsUpdate(cid, leftInCart)

            //console.log('leftInCart', leftInCart);

            let purchase_datetime = new Date()
            let purchaser = req.user.email
            let code = (Math.random() + 1).toString(36).substring(7);
            //req.logger.info(`${code}, ${amount}, ${purchaser}, ${purchase_datetime}`)

            let ticket = await ticketService.purchaseTicket(code, purchase_datetime, purchaseAmount, purchaser)

            const purchaseID = ticket._id
            let datos
            amount = amount.toLocaleString("es-AR");
            exceededStock.length ? datos = { exceededStock, purchaseID, cart, cartItems, amount, username: req.session.user, superUser: req.session.premium || req.session.admin ? true : false } : datos = { cart, purchaseID, purchaseSuccess : true, amount : 0, cartItems : 0, username: req.session.user, superUser: req.session.premium || req.session.admin ? true : false }
            
            res.render('cartPurchaseTicket', datos)

        } catch (error) {
            req.logger.error(error)
        }
    }
}

export default CartsController