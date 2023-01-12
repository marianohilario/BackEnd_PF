class ProductManager{
  constructor(){
    this.products = []
  }
  addProduct = (newItem) => {
    const productDb = this.products.find(product => product.code === newItem.code)
    if (productDb) {
      return `Se encuentra el producto`
    }
    if (newItem.title === '' || newItem.description === '' || newItem.price === '' || newItem.thumbnail === '' || newItem.code === '' || newItem.stock === '')  {
      return `Debe completar el campo title`
    }
    if (this.products.length === 0) {
      newItem.id = 1
      this.products.push(newItem)
    } else {
      this.products = [ ...this.products, { ...newItem, id:this.products[this.products.length -1].id + 1}]
    }
  }
  getProducts = () => this.products
  getProductById = (id) => {
    const productDb = this.products.find(product => product.id === id)
    if (!productDb) {
      return `No existe producto con id: ${id}`
    }
    return productDb
  }
}
const productos = new ProductManager()

console.log(productos.addProduct({
  title: '',
  description: 'esto es un producto',
  price: 1500,
  thumbnail: 'ruta imagen',
  code: 1,
  stock: 100
}))
console.log(productos.addProduct({
  title: 'producto',
  description: 'esto es un producto',
  price: 1500,
  thumbnail: 'ruta imagen',
  code: 2,
  stock: 100
}))
console.log(productos.getProducts())
console.log(productos.getProductById(1))