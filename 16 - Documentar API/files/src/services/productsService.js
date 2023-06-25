import { MongoProductManager } from "../dao/mongo/mongoProductManager.js";
import { ProductsDTO } from "../dto/products.dto.js";

const mongoProductManager = new MongoProductManager

class ProductsService {
    async getProducts(limit) {
        return await mongoProductManager.getProducts(limit)
    }
    
    async getProductById(pid) {
        return await mongoProductManager.getProductById(pid)
    }
    
    async addProduct(newItem) {
        const productsDTO = new ProductsDTO(newItem)
        return await mongoProductManager.addProduct(productsDTO)
    }

    async updateProduct(pid, obj) {
        return await mongoProductManager.updateProduct(pid, obj)
    }

    async deleteProduct(pid) {
        return await mongoProductManager.deleteProduct(pid)
    }
}

export default ProductsService