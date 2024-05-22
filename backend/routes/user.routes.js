const express = require('express');
const asyncWrapper = require('../utility/async_wrapper');
const userController = require('./../controller/user.controller');
const checkRequestAuthentication = require('../middleware/request_authentication');

const router = express.Router();

router.get(
  '/profile',
  checkRequestAuthentication,
  asyncWrapper(userController.getUser)
);

module.exports = router;
