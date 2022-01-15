const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/connectDB");
const { CustomError } = require("../errors");

class User {
  //just for example
  constructor({ phonenumber, password, type, id, status }) {
    this.phonenumber = phonenumber;
    this.password = password;
    this.type = type || "P";
    this.id = id || 0;
    this.status = status || 0;
  }

  async createJWT() {
    let mainId = 0;
    if(this.type === 'M')
    {
      mainId = await User.getManagerID(this.id);
    }
    else if(this.type === 'P')
    {
      mainId = await User.getPatientID(this.id);
    }
    else  //admin
    {
      mainId = this.type;
    }
    return jwt.sign({ id: this.id, type: this.type, mainId }, process.env.JWT_SECRET, {
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
      } else {
        //Do nothing
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

  static async getPatientID(accountID) {
    try {
      const result = await db.query(
        `select patientid from patient where patientaccountid = $1`,
        [accountID]
      );

      const id = result.rows[0].patientid;
      return id;
    } catch (error) {
      return undefined;
    }
  }
  
  static async updateInformation(id, type, { name, dob, address }) {
    try {
      let result = undefined;
      if (type === "P") {
        result = await db.query(
          `update patient set patientname = $1, patientdob = $2, patientaddress = $3 where patientaccountid = $4`,
          [name, dob, address, id]
        );
      } else if (type === "M") {
        result = await db.query(
          `update manager set managername = $1, managerdob = $2, manageraddress = $3 where manageraccountid = $4`,
          [name, dob, address, id]
        );
      } else {
        //Do nothing
      }

      return result.rowCount;
    } catch (error) {
      console.log("Update profile: ", error);
      throw new CustomError('Something went wrong!');
    }
  }

  static async getAllManagers()
  {
    const getPatients = await db.query(
      `select a.status, m.* from account a, manager m where a.id = m.manageraccountid`
    );
    return getPatients.rows;
  }

  static async searchManagerByName(name)
  {
    const result = await db.query(
      'select a.status, m.* from account a, manager m where a.id = m.manageraccountid and m.managername like $1',
      ['%' + name + '%'],
    );

    return result.rows;
  }

  static async insertManager()
  {
    const result = await User.InitUser(

    )
  }
}

module.exports = User;
