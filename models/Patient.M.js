const db = require('../db/connectDB');
const { CustomError } = require('../errors');
const User = require('./User.M');

class Patient {
	constructor ({
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

	static async getAllPatients (managerid) {
		try {
			const result = await db.query(
				`select p.*, a.areaname from patient p, quarantinearea a where managerid = $1 and p.quarantineareaid = a.areaid and p.status <> -1`,
				[ managerid ],
			);

			return result.rows;
		} catch (error) {
			return undefined;
		}
	}

	static async getAllPatientsByName (managerid, patientname) {
		try {
			const result = await db.query(
				`select p.*, a.areaname from patient p, quarantinearea a where managerid = $1 and p.quarantineareaid = a.areaid and lower(p.patientname) like $2 and p.status <> -1`,
				[ managerid, '%' + patientname + '%' ],
			);
			console.log(result.rows);
			return result.rows;
		} catch (error) {
			console.log(error);
			return undefined;
		}
	}

	static async getPatientById (patientId, managerid) {
		try {
			const result = await db.query(
				`select p.*, a.areaname from patient p, quarantinearea a where p.patientid = $1 and p.quarantineareaid = a.areaid and managerid = $2`,
				[ patientId, managerid ],
			);

			return result.rows[0];
		} catch (error) {
			console.log('get patient by id: ', error);
			return undefined;
		}
	}

	static async deletePatientById (patientId, managerid) {
		try {
			const result = await db.query(
				`update patient set status = -1 where patientid = $1 and managerid = $2`,
				[ patientId, managerid ],
			);

			return result.rowCount;
		} catch (error) {
			console.log('delete patient by id: ', error);
			return undefined;
		}
	}

	static async insertPatient (patientInfo, managerid) {
		const userAccount = await User.InitUser(
			patientInfo.patientphone,
			patientInfo.patientidnumber,
		);

		const createAccountResult = await db.query(
			`insert into account (password, phonenumber, type, status) 
      values($1, $2, 'P', 1) returning id`,
			[ userAccount.password, userAccount.phonenumber ],
		);

		if (!createAccountResult.rows[0].id) {
			throw new CustomError('Something wrong with create patient account');
		}

		const accountid = createAccountResult.rows[0].id;
		const {
			quarantinearea,
			status,
			patientname,
			patientidnumber,
			patientdob,
			patientphone,
			patientaddress,
			startdate,
			enddate,
		} = patientInfo;

		const result = await db.query(
			`insert into patient(patientaccountid, quarantineareaid, status, startdate, enddate, managerid, patientname, patientdob, patientaddress, patientidnumber, patientphone) 
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
			[
				accountid,
				quarantinearea,
				status,
				startdate,
				enddate,
				managerid,
				patientname,
				patientdob,
				patientaddress,
				patientidnumber,
				patientphone,
			],
		);

		if (!result || result.rowCount < 1) {
			throw new CustomError('Something wrong with create patient data');
		}

		return result.rowCount;
	}

	static async updatePatient (patientId, patientInfo) {
		const { status } = patientInfo;
		const updateStatusPatient = await db.query(`call updatepatientstatus($1, $2)`, [
			patientId,
			status,
		]);
		return updateStatusPatient;
	}

	static async getContactPatients (patientId) {
		const result = await db.query(`SELECT * FROM SEE_DIRECT_CONTACT_LIST ($1)`, [ patientId ]);

		return result.rows;
	}
}

module.exports = Patient;
