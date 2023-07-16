import { Router } from "express";
import { MailController } from "../controllers/mailController.js";

const router = new Router()
const mailController = new MailController

// Render recovery password mail
router.get('/', mailController.mailRender)

// Send recovery password mail
router.post('/', mailController.sendMail)

export default router