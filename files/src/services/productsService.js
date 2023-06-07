import { MongoProductManager } from "../dao/mongo/mongoProductManager.js";

const mongoProductManager = new MongoProductManager

class ProductsService {
    async getProducts(limit) {
        return await mongoProductManager.getProducts(limit)
    }

    async getProductById(pid) {
        return await mongoProductManager.getProductById(pid)
    }

    async addProduct(newItem) {
        return await mongoProductManager.addProduct(newItem)
    }

    async updateProduct(pid, obj) {
        return await mongoProductManager.updateProduct(pid, obj)
    }

    async deleteProduct(pid) {
        return await mongoProductManager.deleteProduct(pid)
    }
}

export default ProductsService