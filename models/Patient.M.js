const db = require("../db/connectDB");

class Patient {
  constructor({
    patientname,
    patientdob,
    patientaddress,
    patientidnumber,
    patientphone,
    status,
    startdate,
    enddate,
  }) {
    this.patientname = patientname;
    this.patientdob = patientdob;
    this.patientaddress = patientaddress;
    this.patientidnumber = patientidnumber;
    this.patientphone = patientphone;
    this.status = status;
    this.startdate = startdate;
    this.enddate = enddate;
  }

  static async getAllPatients(managerid) {
    try {
      const result = await db.query(`select * from patient where managerid = $1`, [
        managerid,
      ]);

      return result.rows;
    } catch (error) {
        return undefined;
    }
  }
}

module.exports = Patient;
