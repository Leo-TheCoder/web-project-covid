const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/connectDB");

class User {
  //just for example
  constructor({ phonenumber, password, type, id, status }) {
    this.phonenumber = phonenumber;
    this.password = password;
    this.type = type || "P";
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
    const user = new User({ phonenumber, password });
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
      return undefined;
    }
  }

  static async getInformation(id, type) {
    try {
      let queryStr = ``;
      if (type === "P") {
        queryStr = `select * from patient where patientaccountid = ${id}`;
      } else if (type === "M") {
        queryStr = `select * from manager where manageraccountid = ${id}`;
      }

      const result = await db.query(queryStr);
      const information = result.rows[0];
      return information;
    } catch (error) {
      return undefined;
    }
  }

  static async getManagerID(accountID) {
    try {
      const result = await db.query(
        `select managerid from manager where manageraccountid = $1`,
        [accountID]
      );

      const id = result.rows[0].managerid;
      return id;
    } catch (error) {
      return undefined;
    }
  }
}

module.exports = User;
