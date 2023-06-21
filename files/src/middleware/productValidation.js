import CustomError from "../errors/customError.js"
import EErrors from "../errors/enum.js"
import { generateCartProductErrorInfo } from "../errors/info.js"
import ProductsService from "../services/productsService.js"

const productsService = new ProductsService

export default async function productIdValidation (req, res, next){
    const { pid } = req.params
    try {
        let product = await productsService.getProductById(pid)
        if (!product) {
            CustomError.createError({
                name: 'product not finded',
                cause: generateCartProductErrorInfo(pid),
                message: 'Error trying upload products to cart',
                code: EErrors.DATABASE_ERROR
            })
            return res.status(401).send('Producto no encontrado en la Base de Datos')
        }
        return next()
    } catch (error) {
        console.log(error);
    }
}