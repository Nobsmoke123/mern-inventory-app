const UserModel = require('./../model/user.model');

const bcrypt = require('bcrypt');

const { updatePasswordSchema } = require('../validators/validation_schemas');

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
}

module.exports = new UserController();
