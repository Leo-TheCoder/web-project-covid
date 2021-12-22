const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/connectDB");

class User {
  //just for example
  constructor({ phonenumber, password, type, id, status }) {
    this.phonenumber = phonenumber;
    this.password = password;
    this.type = type;
    this.id = id || 0;
    this.status = status || 0;
  }

  createJWT() {
    return jwt.sign({ id: this.id, type: this.type }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
  }

  async comparePassword(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  }

  static async InitUser(phonenumber, password) {
    const user = new User(phonenumber, password);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return user;
  }

  static async getUser(phonenumber) {
    try {
      const result = await db.query(
        `select * from account where phonenumber = $1`,
        [phonenumber]
      );

      let user = new User(result.rows[0]);
      return user;
    } catch (error) {
      let user = undefined;
      return user;
    }
  }
}

module.exports = User;
