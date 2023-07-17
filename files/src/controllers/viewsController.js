import CartsService from '../services/cartsService.js'
import ProductsService from '../services/productsService.js'
import logger from "../utils/logger.js";

const cartsService = new CartsService
const productsService = new ProductsService

class ViewsController {
    productsRender = async (req, res)=>{
        const {limit = 3 , page = 1, query = "", sort = "desc"} = req.query
        let filtro = {}
        query ? filtro = {category: query} : filtro = {}
        let cartItems = 0
        try {
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getProducts(limit, page, filtro, sort)
            const docsAux = docs.map( (elemet) => {
                elemet.description = `${elemet.description.substring(0,75)} ...`
                elemet.price = elemet.price.toLocaleString("es-AR");
            })
            
            const cid = req.session.cart
            const cartProducts = await cartsService.cartProducts(cid, limit, page)
            const aux = cartProducts.docs.length

            aux ? cartItems = cartProducts.docs[0].products.length : cartItems = 0

            let datos = {
                productos: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
                limit,
                query,
                username: req.session.user,
                AdminUser: req.session.admin,
                PremiumUser: req.session.premium,
                cart: req.session.cart,
                cartItems
            }
                res.render('home', datos)
        } catch (error) {
            logger.error(error)
        }
    }

    realTimeProductsRender = async (req, res) => {
        const {limit = 3 , page = 1} = req.query
        let cartItems = 0
        try {
            const cid = req.session.cart
            const cartProducts = await cartsService.cartProducts(cid, limit, page)
            const aux = cartProducts.docs.length
    
            aux ? cartItems = cartProducts.docs[0].products.length : cartItems = 0
            
            const query = { owner: req.session.email }
            const sort = 'desc'
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getProducts(limit, page, query, sort)
            const docsAux = docs.map( (elemet) => {
                elemet.description = `${elemet.description.substring(0,75)} ...`
                elemet.price = elemet.price.toLocaleString("es-AR");
            })

            let datos = {
                productos: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
                username: req.session.user,
                AdminUser: req.session.admin,
                PremiumUser: req.session.premium,
                cart: req.session.cart,
                cartItems
            }
            res.render('realTimeProducts', datos)
        } catch (error) {
            logger.error(error)
        }
    }

    messages = (req, res) => {
        res.render('messages')
    }
}

export default ViewsController