const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'userId is required.'],
    ref: 'User',
  },

  token: {
    type: String,
    required: [true, 'Token is required.'],
  },

  createdAt: {
    type: Date,
    required: [true, 'Created at.'],
  },

  expiresAt: {
    type: Date,
    required: [true, 'Expires at.'],
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
