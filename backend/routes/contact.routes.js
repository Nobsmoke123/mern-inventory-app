const express = require('express');
const asyncWrapper = require('../utility/async_wrapper');
const contactController = require('./../controller/contact.controller');
const checkRequestAuthentication = require('../middleware/request_authentication');

const router = express.Router();

router.post(
  '/contact-us',
  checkRequestAuthentication,
  asyncWrapper(contactController.contactUs)
);

module.exports = router;
