import express from 'express'
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.js'
import __dirname from './utils.js'
import { MongoProductManager } from './dao/mongo/mongoProductManager.js'
import dbConnection from './config/dbConnection.js'
import chatModel from './models/messages.js'

const app = express ()
const PORT = 8080

dbConnection()

const productManager = new MongoProductManager()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/public' ,express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

const httpServer = app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log('Escuchando puerto: ', PORT);
})

httpServer.on

const socketServer = new Server(httpServer)

let productos
let mensajes

socketServer.on('connection', async socket => {
    console.log('Nuevo cliente conectado')
    try {
        productos = await productManager.getProducts()
        console.log(productos);
        mensajes = await chatModel.find()
        socket.emit('mensajeServer', productos)
        socket.emit('mensajesChat', mensajes)
    } catch (error) {
        console.log(error)
    }

    socket.on('product', async data => {
      
      const   {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail
      } = data
      data.status = true

        if (title || description || code || price || stock || category) {
            try {
                await productManager.addProduct(data)
                let datos = await productManager.getProducts()
                socketServer.emit('productoAgregado', datos)
            } catch (error) {
                console.log(error)
            }
        }else{
            console.log('Debe completar todos los campos');
        }
    })

    socket.on('deleteProduct', async data => {
        try {
            await productManager.deleteProduct(data)
            let datos = await productManager.getProducts()
            socketServer.emit('productoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('msg', async data => {
        try {
            await chatModel.insertMany(data)
            let datos = await chatModel.find()
            socketServer.emit('Mensaje', datos)
        } catch (error) {
            console.log(error);
        }
    })
})