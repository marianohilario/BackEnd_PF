import { Router } from "express";
import UsersController from "../controllers/usersController.js";
import { uploader } from "../middleware/multer.js"

const router = Router()
const usersController = new UsersController

// Render password change
router.get('/changePassword/:token', usersController.renderChangePassword)

// Reset password
router.post('/changePassword', usersController.changePassword)

// Get all users
router.get('/', usersController.getUsers)

// Asign Premium Role
router.get('/premium/:uid', usersController.rollSwitch)

// Delete user
router.delete('/:uid', usersController.deleteUser)

// Delete inactive users
router.get('/inactiveusers', usersController.deleteInactiveUsers)


router.get('/:uid/documents', usersController.documentsRender)
router.post('/:uid/documents', 
                            //uploader.array('profile'), 
                            //uploader.array('products'), 
                            uploader.array('documents'), 
                            usersController.uploadDocuments)

export default router