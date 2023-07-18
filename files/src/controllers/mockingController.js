import { generateProduct } from "../utils/faker.js";

class MockingController {
  getMocks = async (req, res) => {
    let products = [];

    for (let i = 0; i < 100; i++) {
      let product = generateProduct();
      products.push(product);
    }
    res.send({
      status: "ok",
      payload: products,
    });
  };
}

export default MockingController;
