import CartsService from '../services/cartsService.js'
import ViewsService from '../services/viewsService.js'
import cartsModel from "../models/carts.js";

const viewsService = new ViewsService
const cartsService = new CartsService

class ViewsController {
    productsRender = async (req, res)=>{
        const {limit = 3 , page = 1, query = "", sort = "desc"} = req.query
        let filtro = {}
        query ? filtro = {category: query} : filtro = {}
        let cartItems = 0
        try {
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await viewsService.getProducts(limit, page, filtro, sort)
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
                superUser: req.session.premium || req.session.admin ? true : false,
                cart: req.session.cart,
                cartItems
            }
                res.render('home', datos)
        } catch (error) {
            req.logger.error(error)
        }
    }

    realTimeProductsRender = (req = request, res)=>{
        res.render('realTimeProducts')
    }

    messages = (req = request, res) => {
        res.render('messages')
    }
}

export default ViewsController