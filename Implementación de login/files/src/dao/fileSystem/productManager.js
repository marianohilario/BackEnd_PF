import fs from 'fs'

/* ------------------------------------------ DECLARO LA CLASE ------------------------------------------ */
export class ProductManager{
  #ruta = './productos.json'
  constructor(){
    this.products = []
    this.path = this.#ruta
  }
  
  addProduct = async (newItem) => {
    let productDb = await this.getProducts()
    try {
      if (productDb.length === 0) {
        newItem.id = 1
        productDb.push(newItem)
      } else {
        productDb = [ ...productDb, { ...newItem, id:productDb[productDb.length -1].id + 1}]
      }
      await fs.promises.writeFile(this.path, JSON.stringify(productDb, null,'\t'))
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
    const productDb = JSON.parse(data).slice(id-1,id)
    if (!productDb) {
      return console.log(`No existe producto con el id: ${id}`)
    }
    return console.log(productDb)
  }
  updateProduct = async (id, objetoActualizar) => {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const productDb = await JSON.parse(data)
    const index = await productDb.findIndex(product => product.id.toString() === id)
    if (index === -1) {
      return console.log(`No existe producto con el id: ${id}`)
    }
    productDb[index] = { ...objetoActualizar, id: productDb[index].id }
    await fs.promises.writeFile(this.path, JSON.stringify(productDb, null,'\t'))
    console.log('Producto actualizado en la base de datos');
  }
  deleteProduct = async (id) => {
    const data = await fs.promises.readFile(this.path, 'utf-8')
    const productDb = await JSON.parse(data)
    const index = await productDb.findIndex(product => product.id.toString() === id)
    if (index === -1) {
      return console.log(`No existe producto con el id: ${id}`)
    }
    productDb.splice(index, 1)
    await fs.promises.writeFile(this.path, JSON.stringify(productDb, null,'\t'))
    console.log('Producto eliminado de la base de datos');
  }
}
