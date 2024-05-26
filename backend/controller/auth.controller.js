const jwt = require('../utility/generate_jwt_token');
const UserModel = require('../model/user.model');
const validator = require('../validators/validation_schemas');
const validatePassword = require('../utility/validate_password');
const Token = require('../model/token.model');
const sendEmail = require('./../utility/email_util');

const {
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/validation_schemas');

const crypto = require('crypto');

class AuthController {
  async signUp(req, res) {
    await validator.signupSchema.validateAsync(req.body);
    const { name, email, password } = req.body;
    const foundUser = await UserModel.findOne({ email });

    if (foundUser) {
      return res.status(400).json({
        status: 400,
        message: `User with email '${email}' already exists.`,
      });
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    const token = jwt.generateToken(newUser._id, newUser.email);

    // Send Http-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // sameSite: 'none',
      // secure: true,
    });

    return res.status(201).json({
      message: 'User created successfully',
      status: 201,
      user: newUser,
      access_token: token,
    });
  }

  async signIn(req, res) {
    await validator.loginSchema.validateAsync(req.body);
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        msg: 'Invalid email or password.',
      });
    }

    // Check the password entered if it matches\
    if (!(await validatePassword(password, user.password))) {
      return res.status(200).json({
        msg: 'Invalid email or password.',
      });
    }

    const token = jwt.generateToken(user._id, user.email);

    // Send Http-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // sameSite: 'none',
      // secure: true,
    });

    return res.status(200).json({
      message: 'Successful Login',
      user,
      access_token: token,
    });
  }

  async logOut(req, res) {
    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),
      // sameSite: 'none',
      // secure: true,
    });

    return res.status(200).json({
      msg: 'Logout successful.',
    });
  }

  async authenticationStatus(req, res) {
    const token = req.cookies.token || '';

    if (token === '') {
      return res.status(200).json({
        status: false,
      });
    }

    if (!jwt.verifyToken(token)) {
      return res.status(200).json({
        status: false,
      });
    }

    return res.status(200).json({
      status: true,
    });
  }

  async forgotPassword(req, res) {
    await forgotPasswordSchema.validateAsync(req.body);

    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: `Reset password sent to the email ${email}`,
      });
    }

    const token = await Token.findOne({
      userId: user._id,
    });

    if (token) {
      await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString('hex') + user._id;

    console.log(`The reset token is ${resetToken}`);

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await Token.create({
      token: hashedToken,
      userId: user._id,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000),
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Reset email
    const message = `
      <h2>Hello ${user.name},</h2>
      <p>Please use the url below to reset your password.</p>
      <p>This reset link is valid for only 30 minutes.</p>
      <a href='${resetUrl}' target='_blank' clicktracking=off>${resetUrl}</a>
      <p>Regards...</p>
      <p>The Innovative Dev</p>
    `;

    const subject = 'Innovative Dev - Password Reset Request';
    const receipient = user.email;
    const sender = process.env.EMAIL_USER;
    const reply_to = 'no_reply@outlook.com';

    try {
      await sendEmail(subject, message, receipient, sender, reply_to);

      return res.status(200).json({
        msg: `Password reset link sent to ${email}`,
      });
    } catch (error) {
      res.status(500);
      const mailError = new Error();
      mailError.name = `MAIL_ERROR: ${error.name}`;
      mailError.stack = error.stack;
      mailError.message = error.message;
      throw mailError;
    }
  }

  async resetPassword(req, res) {
    await resetPasswordSchema.validateAsync(req.body);

    const { password } = req.body;
    const { resetToken } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const token = await Token.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!token) {
      return res.status(401).json({
        msg: 'User unauthorized.',
      });
    }

    const user = await UserModel.findOne({
      _id: token.userId,
    });

    user.password = password;
    await user.save();

    return res.status(200).json({
      msg: 'User password updated successfully.',
    });
  }
}

module.exports = new AuthController();
