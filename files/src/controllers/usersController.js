import jwt from "jsonwebtoken";
import { createHash, comparePassword } from "../utils/bcryptPass.js";
import SessionsService from "../services/sessionsService.js";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import userModel from "../models/user.model.js"
import { createTransport } from "nodemailer";

const sessionsService = new SessionsService();

class UserController {
  getUsers = async (req, res) => {
    const {limit = 3 , page = 1} = req.query
    const auxUsers = []
    try {
      let users = await sessionsService.getUsers(limit, page)
      for (let index = 0; index < users.docs.length; index++) {
        const user = users.docs[index];
        const { email, roll, last_connection, first_name, last_name, id } = user
        const newObject = { email, roll, last_connection, first_name, last_name, id }
        newObject.roll === 'Admin' ? newObject.Admin = true : newObject.Admin = false
        newObject.roll === 'Premium' ? newObject.Premium = true : newObject.Premium = false
        newObject.roll === 'user' ? newObject.user = true : newObject.user = false
        newObject.documents = user.documents.length === 3 ? newObject.documents = true : newObject.documents = false
        newObject.remainingDocuments = 3 - user.documents.length
        auxUsers.push(newObject)
      }
      let datos = {
        auxUsers,
        totalDocs: users.totalDocs,
        limit: users.limit,
        totalPages: users.totalPages,
        page: users.page,
        pagingCounter: users.pagingCounter,
        hasPrevPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        prevPage: users.prevPage,
        nextPage: users.nextPage,
        AdminUser: req.session.admin,
        PremiumUser: req.session.premium,
      }
      res.status(200).render('users', datos) 
    } catch (error) {
      logger.error(error)
    }
  }


  deleteInactiveUsers = async (req, res) => {
    let currentDateObj = new Date();
    console.log(currentDateObj);
    let numberOfMlSeconds = currentDateObj.getTime();
    let addMlSeconds = -60 * 60000 * 48; //48 horas expresado en milisegundos
    let newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    console.log(newDateObj);

    let users = await userModel.find({last_connection: {$lt: newDateObj}})

    for (let index = 0; index < users.length; index++) {
        const user = users[index];
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
                from: `CoderCommerce <${config.testMailAdmin}>`,
                to: user.email,
                subject: "Cuenta eliminada por inactividad",
                html: `
                        <div>
                            <h1>CoderCommerce - Curso Backend CoderHouse</h1>
                            <h4>Su cuenta ha sido eliminada por inactividad</h4>
                            <h4>Click en el enlace para volver a registrarse</h4>
                            <a href="http://localhost:8080/auth/register">Registrarse</a>
                            </div>`,
            });
            
            await sessionsService.deleteUser(user._id.toHexString())
        } catch (error) {
            console.log(error);
        }    
    }
    req.flash('success_msg', 'Deleted accounts and elimination emails sent successfully')
    res.redirect(`/api/users`)
  }

  deleteUser = async (req, res) => {
    const { uid } = req.params;
    console.log('uid', uid);
    try {
      await sessionsService.deleteUser(uid)
      req.flash('success_msg', 'User deleted successfully')
      res.redirect('/api/users');
    } catch (error) {
      logger.error(error)
    }
  }

  rollSwitch = async (req, res) => {
    const { uid } = req.params;

    try {
      let user = await sessionsService.getUserById(uid);
      if (!user) {
        res.send({
          status: "error",
          message: "El usuario no existe",
        });
      }
      if (user.roll === "user") {
        if (!user.documents || user.documents.length < 3) {
          return res.status(400).send({
            status: "error",
            error: `No ha terminado de procesar su documentación, le falta cargar ${
              3 - user.documents.length
            } ${3 - user.documents.length > 1 ? "documentos" : "documento"}.`,
          });
        }
      }
      await sessionsService.updateRoll(
        user.email,
        `${user.roll === "Premium" ? "user" : "Premium"}`
      );
      req.flash('success_msg', 'Role changed successfully')
      res.redirect('/api/users');
    } catch (error) {
      logger.error(error);
    }
  };

  changePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await sessionsService.getUser(email);

      if (comparePassword(user, password)) {
        res.send("You cannot repeat the old password");
      } else {
        await sessionsService.updateUser(email, createHash(password));
        req.flash('success_msg', 'Password re-established')
        res.redirect('/auth/login')
      }
    } catch (error) {
      logger.error(error);
    }
  };

  renderChangePassword = async (req, res) => {
    const { token } = req.params;
    try {
      jwt.verify(token, config.jwtPrivateKey, (error) => {
        if (error) {
          res.redirect("/api/mail");
        }
        res.render("changePassword");
      });
    } catch (error) {
      logger.error(error);
    }
  };

  documentsRender = (req, res) => {
    res.render("profile");
  };

  uploadDocuments = async (req, res) => {
    const file = req.files;
    if (file[0].fieldname === "documents") {
      try {
        const { uid } = req.params;
        if (!file)
          res
            .status(400)
            .send({ status: error, error: "No se pudo guardar la imagen" });

        let userData = await sessionsService.getUserById(uid);
        if (!userData) res.status(404).send({ error: "Usuario no encontrado" });

        userData.documents = userData.documents || [];

        file.forEach((file) => {
          userData.documents.push({
            name: file.filename,
            reference: file.destination,
          });
        });

        let user = await sessionsService.uploadDocument(
          uid,
          userData.documents
        );
        res.send({ status: "ok", link: req.files.path, user });
      } catch (error) {
        logger.error(error);
      }
    } else {
      res.send({ message: "Image uploaded successfully" });
    }
  };
}

export default UserController;
