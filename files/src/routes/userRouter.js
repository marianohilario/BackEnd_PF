import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { uploader } from "../middleware/multer.js"
import { rollAminVerify } from "../middleware/rollVerify.js";

const router = Router()
const usersController = new UsersController

// Render password change
router.get('/changePassword/:token', usersController.renderChangePassword)

// Reset password
router.post('/changePassword', usersController.changePassword)

// Users manager
router.get('/', rollAminVerify, usersController.getUsers)

// Asign Premium Role
router.get('/premium/:uid', rollAminVerify, usersController.rollSwitch)

// Delete user
router.delete('/:uid', rollAminVerify,  usersController.deleteUser)

// Delete inactive users
router.delete('/', rollAminVerify, usersController.deleteInactiveUsers)


router.get('/:uid/documents', usersController.documentsRender)
router.post('/:uid/documents', 
                            //uploader.array('profile'), 
                            //uploader.array('products'), 
                            uploader.array('documents'), 
                            usersController.uploadDocuments)

export default router