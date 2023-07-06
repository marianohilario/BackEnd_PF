import { Router } from "express";
import UsersController from "../controllers/usersController.js";

const router = Router()
const usersController = new UsersController

router.get('/premium/:uid', usersController.rollSwitch)
router.get('/changePassword/:token', usersController.renderChangePassword)
router.post('/changePassword', usersController.changePassword)

export default router