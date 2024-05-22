const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },

    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Enter a valid email.',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
      minLength: [6, 'Minimum password length is 6.'],
    },

    photo: {
      type: String,
      default: '',
    },

    phone: {
      type: String,
      minLength: [11, 'Phone number must be 11 digits.'],
    },

    bio: {
      type: String,
      maxLength: [250, 'Bio must not be more than 250 characters.'],
      default: 'Please enter your bio.',
    },
  },
  {
    timestamps: true,
  }
);

// Pre save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
