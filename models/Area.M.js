const db = require("../db/connectDB");

class Area {
  static async getAreas() {
    try {
      const result = await db.query(
        `select * from Get_Quarantine_Area`
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }

  static async getAreaById(areaid)
  {
	  const result = await db.query(
		  `select q.*, c.countryname, d.districtname, w.wardname from quarantinearea q, country c, district d, ward w 
		  where q.countryid = c.countryid and q.districtid = d.districtid and q.wardid = w.wardid and q.areaid = $1`,
		  [areaid]
	  )

	  return result.rows[0];
  }

  static async insertArea({
    areaname,
    capacity,
    occupated,
    countryid,
    districtid,
    wardid,
  }) {
    const result = await db.query(
      `insert into quarantinearea(areaname, capacity, occupated, countryid, districtid, wardid, deleted) 
		values($1, $2, $3, $4, $5, $6, 0)`,
      [areaname, capacity, occupated, countryid, districtid, wardid]
    );

    if (!result || result.rowCount < 1) {
      return false;
    }

    return true;
  }

  static async updateArea(
    { areaname, capacity, occupated, countryid, districtid, wardid },
    areaid
  ) {
    const result = await db.query(
      `update quarantinearea set areaname = $1, capacity = $2, occupated = $3, countryid = $4, districtid = $5, wardid = $6 
	  where areaid = $7`,
      [areaname, capacity, occupated, countryid, districtid, wardid, areaid]
    );

    if (!result || result.rowCount < 1) {
      return false;
    }

    return true;
  }

  static async deleteArea(areaid) {
    const result = await db.query(
      `update quarantinearea set deleted = 1 where areaid = $1`,
      [areaid]
    );

    if (!result || result.rowCount < 1) {
      return false;
    }

    return true;
  }
}

module.exports = Area;
