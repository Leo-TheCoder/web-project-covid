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
      const result = await db.query(
        `select p.*, a.areaname from patient p, quarantinearea a where managerid = $1 and p.quarantineareaid = a.areaid`,
        [managerid]
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }

  static async getPatientById(patientId, managerid) {
    try {
      const result = await db.query(
        `select p.*, a.areaname from patient p, quarantinearea a where p.patientid = $1 and p.quarantineareaid = a.areaid and managerid = $2`,
        [patientId, managerid]
      );

      return result.rows[0];
    } catch (error) {
      console.log("get patient by id: ", error);
      return undefined;
    }
  }

  static async deletePatientById(patientId, managerid) {
    try {
      const result = await db.query(
        `delete from patient where patientid = $1 and managerid = $2`,
        [patientId, managerid]
      );

      return result.rowCount;
    } catch (error) {
      console.log("delete patient by id: ", error);
      return undefined;
    }
  }

  static async insertPatient(patientInfo, managerid)
  {
    const result = await db.query(
      
    )
  }
}

module.exports = Patient;
