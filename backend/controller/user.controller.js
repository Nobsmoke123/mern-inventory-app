const UserModel = require('./../model/user.model');

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
}

module.exports = new UserController();
