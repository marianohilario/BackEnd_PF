import productsModel from "../../models/products.js";
import logger from "../../utils/logger.js";

export class MongoProductManager {
  async addProduct(newItem) {
    try {
      await productsModel.create(newItem);
    } catch (error) {
      logger.error(error);
    }
  }

  async getProducts(limit, page, query, sort) {
    try {
      sort === "asc" ? (sort = 1) : (sort = -1);
      let products = await productsModel.paginate(query, {
        limit: 5,
        page: page,
        sort: { price: sort },
        lean: true,
      });
      if (!limit) {
        return products;
      }
      return (products = await productsModel.paginate(query, {
        limit: limit,
        page: page,
        sort: { price: sort },
        lean: true,
      }));
    } catch (error) {
      logger.error(error);
    }
  }

  async getProductById(pid) {
    try {
      const data = await productsModel.find();

      return data.find((product) => product.id == pid);
    } catch (error) {
      req.logger.error(error);
      //console.log(error)
    }
  }

  async updateProduct(pid, obj) {
    try {
      await productsModel.findOneAndReplace({ _id: pid }, obj);
    } catch (error) {
      logger.error(error);
    }
  }

  async deleteProduct(pid) {
    try {
      await productsModel.findOneAndDelete({ _id: pid });
    } catch (error) {
      logger.error("err: ", error);
    }
  }
}
