const UserModel = require('./../model/user.model');
const { contactValidationSchema } = require('../validators/validation_schemas');
const sendEmail = require('./../utility/email_util');

class ContactController {
  async contactUs(req, res) {
    await contactValidationSchema.validateAsync(req.body);

    const { subject, message } = req.body;

    const userId = req.user._id;

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({
        msg: 'Unauthorized user.',
      });
    }
    const sender = process.env.EMAIL_USER;
    const receipient = process.env.EMAIL_USER;
    const reply_to = user.email;

    try {
      await sendEmail(subject, message, receipient, sender, reply_to);

      return res.status(200).json({
        msg: 'Mail sent successfully.',
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
}

module.exports = new ContactController();
