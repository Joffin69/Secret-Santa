const express = require("express");
const router = express.Router();

const userController = require('../controller/user-controller');

router.post('/signup', userController.userSignUp);

router.post('/login', userController.userLogin);

router.get('/getUser/:id', userController.getUser);

router.get('/:id' , userController.getUsers);

router.post('/setangel', userController.setAngel);

module.exports = router;
