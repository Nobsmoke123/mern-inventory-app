const Token = require('../model/token.model');

const {
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/validation_schemas');

const UserModel = require('./../model/user.model');

const bcrypt = require('bcrypt');

const crypto = require('crypto');

const sendEmail = require('./../utility/email_util');

class UserController {
  async getUser(req, res) {
    const userId = req.user._id;

    const user = await UserModel.findOne({ _id: userId }).select('-password');

    if (!user) {
      return res.status(401).json({
        user: null,
      });
    }

    return res.status(200).json({
      msg: 'User profile',
      user,
    });
  }

  async updateUser(req, res) {
    const userId = req.user._id;
    const { name, photo, bio, phone } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { name, photo, bio, phone },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(401).json({
        msg: 'User not authorized.',
      });
    }

    return res.status(200).json({
      msg: 'User profile updated',
      user,
    });
  }

  async updatePassword(req, res) {
    await updatePasswordSchema.validateAsync(req.body);

    const userId = req.user._id;

    const { old_password, new_password } = req.body;

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({
        msg: 'User not authorized.',
      });
    }

    const status = await bcrypt.compare(old_password, user.password);

    console.log(`The status is ${status}`);

    if (!(await bcrypt.compare(old_password, user.password))) {
      return res.status(401).json({
        msg: 'Old password is invalid.',
      });
    }

    user.password = new_password;

    await user.save();

    return res.status(200).json({
      msg: 'Password updated successfully.',
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
      throw new Error('Email not sent, please try again.');
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

module.exports = new UserController();
