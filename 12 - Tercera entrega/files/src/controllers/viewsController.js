import { request } from 'express'
import ViewsService from '../services/viewsService.js'

const viewsService = new ViewsService

class ViewsController {
    productsRender = async (req = request, res)=>{
        const {limit = 3 , page = 1, query = "", sort = "desc"} = req.query
        let filtro = {}
        query ? filtro = {category: query} : filtro = {}
        try {
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await viewsService.getProducts(limit, page, filtro, sort)
    
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
                usercart: req.session.cart
            }
            console.log(datos);
            res.render('home', datos)
        } catch (error) {
            console.log(error)
        }
    }

    cartsRender = async (req = request, res)=>{
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
            console.log(error)
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