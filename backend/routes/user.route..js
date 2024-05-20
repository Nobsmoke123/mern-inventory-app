const express = require('express');
const userController = require('./../controller/user.controller');
const asyncWrapper = require('../utility/async_wrapper');
const router = express.Router();

router.post('/signup', asyncWrapper(userController.signUp));

module.exports = router;
