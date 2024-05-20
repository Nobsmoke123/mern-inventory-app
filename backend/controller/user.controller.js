const UserModel = require('./../model/user.model');
const signUpValidator = require('./../validators/signup_validation_schema');

class UserController {
  async signUp(req, res, next) {
    await signUpValidator.validateAsync(req.body);
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

    return res.status(201).json({
      message: 'User created successfully',
      status: 201,
      user: newUser,
    });
  }

  async signIn(req, res, next) {}
}

module.exports = new UserController();
