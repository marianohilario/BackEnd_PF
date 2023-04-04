import { Router } from "express";
import { MongoProductManager } from "../dao/mongo/mongoProductManager.js"
import chatModel from '../models/messages.js'

const router = Router()

const productManager = new MongoProductManager()

router.get('/products', async (req, res)=>{
    try {
        const productos = await productManager.getProducts()
        let datos = {
            productos
        }
        
        res.render('home', datos)
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