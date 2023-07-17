import { createTransport } from "nodemailer";
import config from "../config/config.js";
import { generateToken } from "../utils/jwt.js";
import SessionsService from "../services/sessionsService.js";
import logger from "../utils/logger.js";

const sessionsService = new SessionsService();

export class MailController {
  mailRender = async (req, res) => {
    res.render("mailRecoverPassword");
  };

  sendMail = async (req = request, res) => {
    const { email } = req.body;
    try {
      let user = await sessionsService.getUser(email);

      if (!user){
        req.flash('error_msg', `The email ${email} is not registered`)
        return res.status(401).redirect(`/api/mail`)
    }

      let token = generateToken(user);

      const transport = createTransport({
        service: "gmail",
        port: 578,
        auth: {
          user: config.testMailAdmin,
          pass: config.testMailPass,
        },
      });

      await transport.sendMail({
        from: `CoderCommerce - Recuperación de Pass <${config.testMailAdmin}>`,
        to: email,
        subject: "Recuperar contraseña",
        html: `
                <div>
                    <h1>CoderCommerce - Curso Backend CoderHouse</h1>
                    <h4>Click en el enlace para restablecer contraseña</h4>
                    <a href="http://localhost:8080/api/users/changePassword/${token}">Restablecer Contraseña</a>
                    </div>`,
      });

      req.flash('success_msg', 'Recovery email sent successfully')
      res.redirect(`/auth/login`)
    } catch (error) {
      logger.error(error);
    }
  };
}
