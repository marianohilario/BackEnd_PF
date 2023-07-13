import { MongoCartManager } from "../dao/mongo/mongoCartManager.js"
import { MongoProductManager } from "../dao/mongo/mongoProductManager.js"

const mongoCartManager = new MongoCartManager
const mongoProductManager = new MongoProductManager

class ViewsService {
    async getProducts(limit, page, query, sort) {
        return await mongoProductManager.getProducts(limit, page, query, sort)
    }

    async getCartProducts(cid, limit, page) {
        return await mongoCartManager.CartProducts(cid, limit, page)
    }
}

export default ViewsService