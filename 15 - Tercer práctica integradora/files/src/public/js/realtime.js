import logger from "../../ultis/logger.js";


const submitProduct = document.querySelector('#submitProduct')
//const productID = document.querySelector('#productDelete')
const deleteBtn = document.querySelector('#deleteProduct')

submitProduct.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('realtime_submitProduct');
    //logger.info('logger_info_realtime_submitProduct')
})

deleteBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('realtime_deleteBtn')
    //logger.info('logger_info_realtime_deleteBtn')
})