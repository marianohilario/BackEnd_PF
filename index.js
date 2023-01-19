const fs = require('fs')

/* ------------------------------------------ DECLARO LA CLASE ------------------------------------------ */
class ProductManager{
  constructor(path){
    this.products = []
    this.path = path
  }
  
  addProduct = async (newItem) => {
    if (newItem.title === '' || newItem.description === '' || newItem.price === '' || newItem.thumbnail === '' || newItem.code === '' || newItem.stock === '')  {
      return console.log(`Debe completar todos los campos`)
    }
    let productDb = await this.getProducts()
    const data = await productDb.find(product => product.code === newItem.code)
    try {
      if (data) {
        return console.log(`El código de producto ya existe`)
      }
      if (productDb.length === 0) {
        newItem.id = 1
        productDb.push(newItem)
      } else {
        productDb = [ ...productDb, { ...newItem, id:productDb[productDb.length -1].id + 1}]
      }
      fs.promises.writeFile(this.path, JSON.stringify(productDb, null,'\t'))
      console.log('Producto cargado en la base de datos');
    } catch (error) {
      console.log(error);
    }
  }
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const productDb = JSON.parse(data);
        return productDb;
      }
      await fs.promises.writeFile(this.path, '[]', 'utf-8')
      return []
    } catch (error) {
      console.log(error);
    }
  }
  getProductById = async (id) => {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const productDb = JSON.parse(data).find(product => product.id === id)
    if (!productDb) {
      return console.log(`No existe producto con el id: ${id}`)
    }
    return console.log(productDb)
  }
  updateProduct = async (id, campoActualizar) => {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const productDb = await JSON.parse(data)
    const index = await productDb.findIndex(product => product.id === id)
    if (index === -1) {
      return console.log(`No existe producto con el id: ${id}`)
    }
    productDb[index] = { ...campoActualizar, id: productDb[index].id }
    fs.promises.writeFile(this.path, JSON.stringify(productDb, null,'\t'))
    console.log('Producto actualizado en la base de datos');
  }
  deleteProduct = async (id) => {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const productDb = await JSON.parse(data)
    const index = await productDb.findIndex(product => product.id === id)
    if (index === -1) {
      return console.log(`No existe producto con el id: ${id}`)
    }
    productDb.splice(index, 1)
    fs.promises.writeFile(this.path, JSON.stringify(productDb, null,'\t'))
    console.log('Producto eliminado de la base de datos');
  }
}


const productos = new ProductManager('./files/productos.json')

// productos.addProduct({
//     title: 'producto 3',
//     description: 'esto es un producto',
//     price: 2500,
//   thumbnail: 'ruta imagen',
//   code: 2,
//   stock: 100
// })

// console.log(productos.getProducts())

// console.log(productos.getProductById(2))

// productos.updateProduct(2, {
//   title: 'producto 2 actulizado',
//   description: 'esto es un producto',
//   price: 5000,
//   thumbnail: 'ruta imagen',
//   code: 2,
//   stock: 100
// })

// productos.deleteProduct(2)
