import { Router } from "express";
import { MongoProductManager } from "../dao/mongo/mongoProductManager.js"
import { MongoCartManager } from "../dao/mongo/mongoCartManager.js"
import { auth } from '../middleware/auth.js'

const router = Router()

const productManager = new MongoProductManager()
const cartManager = new MongoCartManager()

router.get('/products', auth, async (req, res)=>{
    const {limit = 3 , page = 1, query = "", sort = "desc"} = req.query
    let filtro = {}
    query ? filtro = {category: query} : filtro = {}
    try {
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProducts(limit, page, filtro, sort)

        let datos = {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            query,
            username: req.session.user
        }
        res.render('home', datos)
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/carts/:cid', async (req, res)=>{
    const {cid} = req.params
    const {limit = 1 , page = 1} = req.query
    try {
        const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = await cartManager.getCartProducts(cid, limit, page)
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
})

router.get('/realtimeproducts', (req, res)=>{
    res.render('realTimeProducts')
})

router.get('/messages', (req, res) => {
    res.render('messages')
})

export default router