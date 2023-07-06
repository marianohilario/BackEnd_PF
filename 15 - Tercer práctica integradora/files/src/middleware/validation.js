import CustomError from "../errors/customError.js"
import EErrors from "../errors/enum.js"
import { generateProductErrorInfo } from "../errors/info.js"

export function validation (req, res, next){
    const newItem = req.body

    if (!newItem.title || !newItem.description || !newItem.price || !newItem.thumbnail || !newItem.code || !newItem.stock || !newItem.category) {
        CustomError.createError({
            name: 'product creation error',
            cause: generateProductErrorInfo({ title, description, code, price, stock, category, thumbnail }),
            message: 'Error trying to create a new product',
            code: EErrors.INVALID_PROPERTIES
        })
        return res.send({mensaje: 'Error en el tipo de datos'})
    }
    return next()
}