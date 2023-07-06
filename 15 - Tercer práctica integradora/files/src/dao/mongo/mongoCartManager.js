import cartsModel from "../../models/carts.js"
import logger from "../../ultis/logger.js"

export class MongoCartManager {

    async createCart(){
        try {
            let cart = await cartsModel.create({products: []})
            return cart
        } catch (error) {
            logger.error(error)
        }
    }

    async uploadProduct(cid, pid, quantity){
        try {
            let carrito = await cartsModel.findOne({_id: cid})
            let product = carrito.products.find(product => product.pid === pid)
    
            if (product !== undefined) {
                await cartsModel.updateOne(
                    {
                        _id: cid
                    },
                    {
                        $set:
                        {
                            'products.$[pid]': {'pid': pid, 'quantity': quantity ? quantity : product.quantity + 1}
                        }
                    },
                    {
                        arrayFilters: 
                        [
                            {'pid.pid': pid}
                        ]
                    }
                )
            }
            
            if (product == undefined) {
                await cartsModel.findByIdAndUpdate({"_id": cid}, {$push: {'products': {pid: pid, quantity : 1}}})
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async getCartProducts(cid, limit, page){
        try {
            const cartProducts = await cartsModel.paginate({_id: cid}, {limit: limit, page: page, lean: true})
            return cartProducts
        } catch (error) {
            logger.error(error)
        }
    }

    async deleteProduct(cid, pid){
        try {
            let carrito = await cartsModel.findOne({_id: cid})
            let products = carrito.products.filter(product => product.pid != pid)
            await cartsModel.updateOne(
                {
                    _id: cid
                },
                {
                    $set: 
                    {
                        'products': products
                    }
                }
            )
        } catch (error) {
            logger.error(error)
        }
    }

    async deleteCartProducts(cid){
        try {
            let products = []

            await cartsModel.updateOne(
                {
                    _id: cid
                },
                {
                    $set:
                    {
                        'products': products
                    }
                }
            )
        } catch (error) {
            logger.error(error)
        }
    }

    async arrayProductsUpdate(cid, data){
        try {
            await cartsModel.updateOne(
                {
                    _id: cid
                },
                {
                    $set:
                    {
                        'products': data
                    }
                }
            )
        } catch (error) {
            logger.error(error)
        }
    }
}