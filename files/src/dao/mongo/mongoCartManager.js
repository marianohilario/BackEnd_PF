import cartsModel from "../../models/carts.js";
import logger from "../../utils/logger.js";

export class MongoCartManager {
  async createCart() {
    try {
      let cart = await cartsModel.create({ products: [] });
      return cart;
    } catch (error) {
      logger.error(error);
    }
  }

  async uploadProduct(cid, pid, quantity) {
    try {
      let carrito = await cartsModel.findOne({ _id: cid });
      let product = carrito.products.find((product) => product.pid === pid);

      if (product !== undefined) {
        const cart = await cartsModel.updateOne(
          {
            _id: cid,
          },
          {
            $set: {
              "products.$[pid]": {
                pid: pid,
                quantity: product.quantity + parseInt(quantity),
              },
            },
          },
          {
            arrayFilters: [{ "pid.pid": pid }],
          }
        )
        return cart;
      }

      if (product === undefined) {
        const cart = await cartsModel.findByIdAndUpdate(
          { _id: cid },
          { $push: { products: { pid: pid, quantity: parseInt(quantity) } } }
        );
        return cart;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  async cartProducts(cid, limit, page) {
    try {
      const cartProducts = await cartsModel.paginate(
        { _id: cid },
        { limit: limit, page: page, lean: true }
      );

      return cartProducts;
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteProduct(cid, pid) {
    try {
      let carrito = await cartsModel.findOne({ _id: cid });
      let products = carrito.products.filter((product) => product.pid !== pid);
      await cartsModel.updateOne(
        {
          _id: cid,
        },
        {
          $set: {
            products: products,
          },
        }
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async clearCart(cid) {
    try {
      let products = [];

      await cartsModel.updateOne(
        {
          _id: cid,
        },
        {
          $set: {
            products: products,
          },
        }
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async arrayProductsUpdate(cid, data) {
    try {
      await cartsModel.updateOne(
        {
          _id: cid,
        },
        {
          $set: {
            products: data,
          },
        }
      );
    } catch (error) {
      logger.error(error);
    }
  }
}
