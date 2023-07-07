//const ioServer = io()

const submitProduct = document.querySelector('#submitProduct')
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const code = document.querySelector('#code')
const price = document.querySelector('#price')
const stock = document.querySelector('#stock')
const category = document.querySelector('#category')
const thumbnail = document.querySelector('#thumbnail')

const productID = document.querySelector('#productDelete')
const deleteBtn = document.querySelector('#deleteProduct')
const formDelete = document.querySelector('#formDelete')

const contenedor = document.querySelector('#container')

// submitProduct.addEventListener('click', async (event)=>{
//     event.preventDefault()

//     // let product = {
//     //     title: title.value,
//     //     description: description.value,
//     //     code: code.value,
//     //     price: price.value,
//     //     stock: stock.value,
//     //     category: category.value,
//     //     thumbnail: thumbnail.value
//     // }

//     // logger.info(product);
//     // ioServer.emit('product', product)
//     await productsController.addProduct
// })

deleteBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    console.log('escucha');
    console.log(productID.value);
    formDelete.setAttribute('action', `http://localhost:8080/api/products/${productID.value}?_method=DELETE`)

    formDelete.submit()
    //ioServer.emit('deleteProduct', pid)
})

// ioServer.on('mensajeServer', data =>{
    
//     // logger.info('data:', data);
//     contenedor.innerHTML = ''

//     data.forEach(element => {
//         contenedor.innerHTML +=    `<div>
//                                         <h4>${element.title}</h4>
//                                         <p>${element.description}</p>
//                                         <p>${element.category}</p>
//                                         <p>${element.stock}</p>
//                                         <p>${element.price}</p> 
//                                         <p>${element.id}</p> 
//                                     </div>
//                                    `
//     })
// })

// ioServer.on('productoAgregado', data =>{
//     contenedor.innerHTML = ''

//     data.forEach(element => {
//         contenedor.innerHTML += `<div>
//                                     <h4>${element.title}</h4>
//                                     <p>${element.description}</p>
//                                     <p>${element.category}</p>
//                                     <p>${element.stock}</p>
//                                     <p>${element.price}</p> 
//                                 </div>`
//     })
// })

// ioServer.on('productoEliminado', data =>{
//     contenedor.innerHTML = ''

//     data.forEach(element => {
//         contenedor.innerHTML += `<div>
//                                     <h4>${element.title}</h4>
//                                     <p>${element.description}</p>
//                                     <p>${element.category}</p>
//                                     <p>${element.stock}</p>
//                                     <p>${element.price}</p> 
//                                 </div>`
//     })
// })