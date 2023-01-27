import express from 'express'
import { ProductManager } from './index.js'

const productos = new ProductManager('./files/productos.json')
const app = express()
const PORT = 8080

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req, res) => {
  const { limit } = req.query
  try {
    const data = await productos.getProducts()
    limit ? res.send(data.filter(product => product.id <= limit)) : res.send(data)
  } catch (error) {
    console.log(error)
  }
})

app.get("/products/:pid", async (req, res)=>{
  const pid = req.params.pid
  try {
      const data = await productos.getProducts()

      pid ? res.send(data.find(product => product.id.toString() ===  pid)) : res.send(data)
  } catch (error) {
      console.log(error)
  }
})

app.listen(PORT, err => {
  if (err) console.log(err)
  console.log(`Escuchando en el puerto ${PORT}`)
})