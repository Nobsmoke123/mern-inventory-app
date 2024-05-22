const { verifyToken } = require('../utility/generate_jwt_token');
const UserModel = require('./../model/user.model');

/**
 * checkRequestAuthentication middleware
 * To verify is a request for a page behind authorization is authenticated.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const checkRequestAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.token || '';

    if (token === '') {
      return res.status(401).json({
        msg: 'Not Authorized.',
      });
    }

    const verified = verifyToken(token);

    if (!verified) {
      return res.status(401).json({
        msg: 'Bad Token.',
      });
    }

    const user = await UserModel.findOne({ _id: verified.userId });

    if (!user) {
      return res.status(401).json({
        msg: 'User not authorized.',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = checkRequestAuthentication;
