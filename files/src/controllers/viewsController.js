import CartsService from '../services/cartsService.js'
import ViewsService from '../services/viewsService.js'

const viewsService = new ViewsService
const cartsService = new CartsService

class ViewsController {
    productsRender = async (req, res)=>{
        const {limit = 3 , page = 1, query = "", sort = "desc"} = req.query
        let filtro = {}
        query ? filtro = {category: query} : filtro = {}
        try {
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await viewsService.getProducts(limit, page, filtro, sort)
            const docsAux = docs.map( (elemet) => {
                elemet.description = `${elemet.description.substring(0,75)} ...`
                elemet.price = elemet.price.toLocaleString("es-AR");
            })
            
            const cid = req.session.cart
            
            if (cid !== undefined) {
                const cartProducts = await cartsService.cartProducts(cid, limit, page)
                const cartItems = cartProducts.docs[0].products.length
                if (cartItems > 0) {
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
                        cart: req.session.cart,
                        cartItems
                    }
                    res.render('home', datos)
                } else {
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
                        cart: req.session.cart
                    }
                    res.render('home', datos)
                }
                
            } else {
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
                    cart: req.session.cart
                }
                res.render('home', datos)
            }
        } catch (error) {
            req.logger.error(error)
        }
    }

    cartsRender = async (req, res)=>{
        const {cid} = req.params
        const {limit = 1 , page = 1} = req.query
        try {
            const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await viewsService.getCartProducts(cid, limit, page)
            let data = docs[0].products
            let datos = {
                productos: data,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
                limit
            }
            res.render('carts', datos)
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