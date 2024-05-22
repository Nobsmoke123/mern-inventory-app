const bcrypt = require('bcrypt');

const validatePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = validatePassword;
