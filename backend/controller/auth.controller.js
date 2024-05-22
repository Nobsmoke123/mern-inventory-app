const jwt = require('../utility/generate_jwt_token');
const UserModel = require('../model/user.model');
const validator = require('../validators/validation_schemas');
const validatePassword = require('../utility/validate_password');

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
}

module.exports = new AuthController();
