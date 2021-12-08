const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class User {
  //just for example
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  createJWT() {
    return jwt.sign({ username: this.username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
  }

  async comparePassword(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  }

  static async initUser(username, password) {
    const user = new User(username, password);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return user;
  }
}

module.exports = User;
