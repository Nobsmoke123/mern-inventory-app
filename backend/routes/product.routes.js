const express = require('express');
const checkRequestAuthentication = require('../middleware/request_authentication');
const asyncWrapper = require('../utility/async_wrapper');
const productController = require('./../controller/product.controller');
const { fileUploadErrorCatcher } = require('./../utility/file_upload');

const router = express.Router();

router.post(
  '/',
  checkRequestAuthentication,
  fileUploadErrorCatcher,
  asyncWrapper(productController.createProduct)
);

router.get(
  '/:productId',
  checkRequestAuthentication,
  asyncWrapper(productController.getProduct)
);

router.get(
  '/',
  checkRequestAuthentication,
  asyncWrapper(productController.listProducts)
);

router.patch(
  '/:productId',
  checkRequestAuthentication,
  fileUploadErrorCatcher,
  asyncWrapper(productController.updateProduct)
);

router.delete(
  '/:productId',
  checkRequestAuthentication,
  asyncWrapper(productController.deleteProduct)
);

module.exports = router;
