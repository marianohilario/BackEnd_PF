import { MongoCartManager } from "../dao/mongo/mongoCartManager.js"

const mongoCartManager = new MongoCartManager

class CartsService {
    async createCart(){
        return await mongoCartManager.createCart()
    }

    async cartProducts(cid, limit, page){
        return await mongoCartManager.cartProducts(cid, limit, page)
    }

    async newProduct(cid, pid){
        return await mongoCartManager.uploadProduct(cid, pid)
    }

    async deleteProduct(cid, pid){
        return await mongoCartManager.deleteProduct(cid, pid)
    }

    async uploadProduct(cid, pid, quantity){
        const carrito =  await mongoCartManager.uploadProduct(cid, pid, quantity)
        return carrito
    }

    async deleteCartProducts(cid){
        return await mongoCartManager.deleteCartProducts(cid)
    }

    async arrayProductsUpdate(cid, data){
        return await mongoCartManager.arrayProductsUpdate(cid, data)
    }
}

export default CartsService