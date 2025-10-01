const express = require('express');
const router = express.Router()
const userController = require('../controllers/users.controller')
const userMiddleware = require('../middlewares/users.middleware')

router.post('/signup', userMiddleware.validateSignup, userController.Signup)
router.post('/login', userController.Login)

module.exports = router;


