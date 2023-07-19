import ProductsService from '../services/productsService.js'
import { createTransport } from "nodemailer";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const productsService = new ProductsService

class ProductsController {
    getProducts = async (req, res) => {
      const { limit, page = 1, sort = "desc" } = req.query
      const query = {}
      try {
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await productsService.getProducts(limit, page, query, sort)
        const docsAux = docs.map( (elemet) => {
          elemet.description = `${elemet.description.substring(0,75)} ...`
          elemet.price = elemet.price.toLocaleString("es-AR");
        })
      
        let datos = {
          productos: docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          page,
          limit,
          uid: req.user?._id.toHexString(),
          AdminUser: req.session.admin,
          PremiumUser: req.session.premium,
        }
        res.render('productManager', datos)
      } catch (error) {
          req.logger.error(error)
      }
    }

    getProductById = async (req, res) => {
      const { pid } = req.params
    
      try {
        const productById = await productsService.getProductById(pid)
    
      res.render('productEdit', productById)
      } catch (error) {
          req.logger.error(error)
      }
    }

    addProduct = async (req, res) => {
      const newItem = req.body
      newItem.status = true
      newItem.owner = req.user.roll === "Admin" ? "Admin" : req.session.email
      
      try {
        await productsService.addProduct(newItem)
        req.flash('success_msg', 'Product added successfully')
        res.redirect('/realTimeProducts')
      } catch (error) {
          req.logger.error(error)
      }
    }

    updateProduct = async (req, res) => {
      const { pid } = req.params
      const newItem = req.body
      newItem.status = true
      newItem.owner = req.user.roll === "Admin" ? "Admin" : req.session.email
      const prod = newItem
      try {
        await productsService.updateProduct(pid, prod)
        req.flash('success_msg', 'Product edited successfully')
        req.session.admin ? res.redirect('/api/products') : res.redirect('/realTimeProducts')
      } catch (error) {
          req.logger.error(error)
      }
    }

    delete = async (req, res) => {
      const { pid } = req.params
      try {
        let product = await productsService.getProductById(pid)
        if (!product) {
            return res.status(401).send({mensaje: 'Producto no encontrado en la Base de Datos'})
        } else {
          await productsService.deleteProduct(pid)
          if (req.session.admin) {
            const email = product.owner;
            try {
                const transport = createTransport({
                  service: "gmail",
                  port: 578,
                  auth: {
                    user: config.testMailAdmin,
                    pass: config.testMailPass,
                  },
                });

                await transport.sendMail({
                  from: `CoderCommerce - Producto Eliminado <${config.testMailAdmin}>`,
                  to: email,
                  subject: "Producto Eliminado",
                  html: `
                          <div>
                              <h1>CoderCommerce - Curso Backend CoderHouse</h1>
                              <h4>El siguiente producto ha sido eliminado de su catálogo</h4>
                              <b><h3>${product.title}</h3></b>
                              <img src="${product.thumbnail}" alt="${product.title}"  style="max-height: 140px;">
                              </div>`,
                });
              } catch (error) {
                logger.error(error);
              }
            }
            req.flash('success_msg', 'Product deleted successfully')
            req.session.admin ? res.status(201).redirect('/api/products') : res.status(201).redirect('/realtimeproducts')
        }
      } catch (error) {
          req.logger.error(error)
      }
    }
}

export default ProductsController