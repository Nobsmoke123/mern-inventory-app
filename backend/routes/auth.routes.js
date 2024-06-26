const express = require('express');
const AuthController = require('../controller/auth.controller');
const asyncWrapper = require('../utility/async_wrapper');
const authController = require('../controller/auth.controller');
const router = express.Router();

router.post('/signup', asyncWrapper(AuthController.signUp));

router.post('/signin', asyncWrapper(AuthController.signIn));

router.post('/logout', asyncWrapper(AuthController.logOut));

router.get('/auth-status', asyncWrapper(AuthController.authenticationStatus));

router.post('/forgot-password', asyncWrapper(authController.forgotPassword));

router.put(
  '/reset-password/:resetToken',
  asyncWrapper(authController.resetPassword)
);
module.exports = router;
