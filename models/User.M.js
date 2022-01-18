const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/connectDB');
const { CustomError } = require('../errors');

class User {
	//just for example
	constructor ({ phonenumber, password, type, id, status, first_login }) {
		this.phonenumber = phonenumber;
		this.password = password;
		this.type = type || 'P';
		this.id = id || 0;
		this.status = status || 0;
		this.first_login = first_login || 0;
	}

	async createJWT () {
		let mainId = 0;
		if (this.type === 'M') {
			mainId = await User.getManagerID(this.id);
		}
		else if (this.type === 'P') {
			mainId = await User.getPatientID(this.id);
		}
		else {
			//admin
			mainId = this.id;
		}
		return jwt.sign({ id: this.id, type: this.type, mainId }, process.env.JWT_SECRET, {
			expiresIn : process.env.JWT_LIFETIME,
		});
	}

	async comparePassword (candidatePassword) {
		const isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;
	}

	static async InitUser (phonenumber, password) {
		const user = new User({ phonenumber, password });
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		return user;
	}

	static async getUser (phonenumber) {
		try {
			const result = await db.query(`select * from account where phonenumber = $1`, [
				phonenumber,
			]);

			let user = new User(result.rows[0]);
			return user;
		} catch (error) {
			return undefined;
		}
	}

	static async getInformation (id, type) {
		try {
			let queryStr = ``;
			if (type === 'P') {
				queryStr = `select * from patient where patientaccountid = ${id}`;
			}
			else if (type === 'M') {
				queryStr = `select * from manager where manageraccountid = ${id}`;
			}
			else {
				//Do nothing
			}

			const result = await db.query(queryStr);
			const information = result.rows[0];
			return information;
		} catch (error) {
			return undefined;
		}
	}

	static async getManagerID (accountID) {
		try {
			const result = await db.query(
				`select managerid from manager where manageraccountid = $1`,
				[ accountID ],
			);

			const id = result.rows[0].managerid;
			return id;
		} catch (error) {
			return undefined;
		}
	}

	static async getPatientID (accountID) {
		try {
			const result = await db.query(
				`select patientid from patient where patientaccountid = $1`,
				[ accountID ],
			);

			const id = result.rows[0].patientid;
			return id;
		} catch (error) {
			return undefined;
		}
	}

	static async updateInformation (id, type, { name, dob, address }) {
		try {
			let result = undefined;
			if (type === 'P') {
				result = await db.query(
					`update patient set patientname = $1, patientdob = $2, patientaddress = $3 where patientaccountid = $4`,
					[ name, dob, address, id ],
				);
			}
			else if (type === 'M') {
				result = await db.query(
					`update manager set managername = $1, managerdob = $2, manageraddress = $3 where manageraccountid = $4`,
					[ name, dob, address, id ],
				);
			}
			else {
				//Do nothing
			}

			return result.rowCount;
		} catch (error) {
			console.log('Update profile: ', error);
			throw new CustomError('Something went wrong!');
		}
	}

	static async getAllManagers (sortby) {
		let result;
		if (sortby) {
			const attributeSort = sortby.split('-')[0];
			const isAscend = sortby.split('-')[1] === 'a' ? true : false;

			let query = `select a.id, a.status, m.* from account a, manager m where a.id = m.manageraccountid 
      order by ${attributeSort} `;

			if (isAscend) {
				query += 'asc';
			}
			else {
				query += 'desc';
			}

			result = await db.query(query);
			return result.rows;
		}
		else {
			const getPatients = await db.query(
				`select a.status, m.* from account a, manager m where a.id = m.manageraccountid`,
			);
			return getPatients.rows;
		}
	}

	static async searchManagerByName (name, sortby) {
		let result;
		if (sortby) {
			const attributeSort = sortby.split('-')[0];
			const isAscend = sortby.split('-')[1] === 'a' ? true : false;

			let query = `select a.id, a.status, m.* from account a, manager m 
      where a.id = m.manageraccountid and m.managername like $1 
      order by ${attributeSort} `;

			if (isAscend) {
				query += 'asc';
			}
			else {
				query += 'desc';
			}

			result = await db.query(query, [ '%' + name + '%' ]);
			return result.rows;
		}
		else {
			const result = await db.query(
				'select a.status, m.* from account a, manager m where a.id = m.manageraccountid and m.managername like $1',
				[ '%' + name + '%' ],
			);

			return result.rows;
		}
	}

	static async insertManager (managerInfo) {
		const userAccount = await User.InitUser(
			managerInfo.managerphone,
			managerInfo.manageridnumber,
		);

		const createAccountResult = await db.query(
			`insert into account (password, phonenumber, type, status) 
      values($1, $2, 'M', 1) returning id`,
			[ userAccount.password, userAccount.phonenumber ],
		);

		if (!createAccountResult.rows[0].id) {
			throw new CustomError('Something wrong with create manager account');
		}

		const accountid = createAccountResult.rows[0].id;

		const {
			workareaid,
			managername,
			managerdob,
			managerphone,
			manageridnumber,
			manageraddress,
		} = managerInfo;

		const result = await db.query(
			`insert into manager(manageraccountid, workareaid, managername, managerdob, manageraddress, manageridnumber, managerphone, current) 
    values($1, $2, $3, $4, $5, $6, $7, $8)`,
			[
				accountid,
				workareaid,
				managername,
				managerdob,
				manageraddress,
				manageridnumber,
				managerphone,
				1,
			],
		);

		if (!result || result.rowCount < 1) {
			throw new CustomError('Something wrong with create patient data');
		}

		return result.rowCount;
	}

	static async lockManager (managerid) {
		const changeStatusAccount = db.query(
			`UPDATE account
      SET status=0
      FROM (SELECT id, managerid
            FROM account, manager
            WHERE account.id = manager.manageraccountid and manager.managerid = $1) AS subquery
      WHERE account.id=subquery.id`,
			[ managerid ],
		);

		const changeCurrentManager = db.query(
			`update manager set current = 0 where managerid = $1`,
			[ managerid ],
		);

		const [ changeStatus, changeCurrent ] = await Promise.all([
			changeStatusAccount,
			changeCurrentManager,
		]);

		// console.log(changeStatus, changeCurrent)
		if (changeStatus.rowCount > 0 && changeCurrent.rowCount > 0) {
			return true;
		}

		return false;
	}

	static async unlockManager (managerid) {
		const changeStatusAccount = db.query(
			`UPDATE account
      SET status=1
      FROM (SELECT id, managerid
            FROM account, manager
            WHERE account.id = manager.manageraccountid and manager.managerid = $1) AS subquery
      WHERE account.id=subquery.id`,
			[ managerid ],
		);

		const changeCurrentManager = db.query(
			`update manager set current = 1 where managerid = $1`,
			[ managerid ],
		);

		const [ changeStatus, changeCurrent ] = await Promise.all([
			changeStatusAccount,
			changeCurrentManager,
		]);

		if (changeStatus.rowCount > 0 && changeCurrent.rowCount > 0) {
			return true;
		}

		return false;
	}

	static async updatePassword (id, new_pass) {
		const result = await db.query(
			`UPDATE ACCOUNT
    SET PASSWORD = $1, FIRST_LOGIN = 0
    WHERE ID = $2`,
			[ new_pass, id ],
		);

		if (result.rowCount < 1) {
			throw new CustomError('Update password failed');
		}
		return true;
	}

  static async createAdminAccount(phone_number, password) {
    const result = await db.query(
      `insert into account (phonenumber, password, status, type, first_login) 
      values ($1, $2, 1, $3, $4) returning id`,
      [phone_number, password, 'A', 0]
    )
    if(result.rowCount < 1) {
      throw new CustomError("Something wrong while adding admin");
    }

    const id = resut.rows[0].id;
    return id;
  }
}

module.exports = User;
