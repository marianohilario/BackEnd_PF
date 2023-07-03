const { Router } = require("express");
const UsersController = require("../controllers/usersController.js");

const router = Router()
const usersController = new UsersController

router.get('/premium/:uid', usersController.rollSwitch)
router.get('/changePassword/:token', usersController.renderChangePassword)
router.post('/changePassword', usersController.changePassword)

module.exports = router