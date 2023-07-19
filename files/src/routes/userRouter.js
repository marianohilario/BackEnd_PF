import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { uploader } from "../middleware/multer.js"
import { rollAdminVerify } from "../middleware/rollVerify.js";

const router = Router()
const usersController = new UsersController

// Render password change
router.get('/changePassword/:token', usersController.renderChangePassword)

// Reset password
router.post('/changePassword', usersController.changePassword)

// Users manager
router.get('/', rollAdminVerify, usersController.getUsers)

// Asign Premium Role
router.get('/premium/:uid', rollAdminVerify, usersController.rollSwitch)

// Delete user
router.delete('/:uid', rollAdminVerify,  usersController.deleteUser)

// Delete inactive users
router.delete('/', rollAdminVerify, usersController.deleteInactiveUsers)

router.get('/:uid/profile', usersController.profileRender)
router.post('/:uid/profile', usersController.uploadDocuments)


router.post('/:uid/documents', 
                            //uploader.array('profile'), 
                            //uploader.array('products'), 
                            uploader.array('documents'), 
                            usersController.uploadDocuments)

export default router