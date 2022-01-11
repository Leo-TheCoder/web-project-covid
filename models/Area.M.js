const db = require('../db/connectDB');

class Area {
	static async getArea () {
		try {
			const result = await db.query(`select * from Get_Quarantine_Area`);

			return result.rows;
		} catch (error) {
			return undefined;
		}
	}
}

module.exports = Area;
