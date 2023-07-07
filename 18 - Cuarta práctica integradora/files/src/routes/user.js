import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { uploader } from "../ultis/multer.js"

const router = Router()
const usersController = new UsersController

router.get('/premium/:uid', usersController.rollSwitch)
router.get('/changePassword/:token', usersController.renderChangePassword)
router.post('/changePassword', usersController.changePassword)
router.post('/:uid/documents', usersController.uploadDocument)

export default router