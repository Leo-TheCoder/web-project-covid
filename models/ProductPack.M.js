const db = require("../db/connectDB");
const { NotFoundError } = require("../errors");

class ProductPack {
  static async getPacks() {
    const result = await db.query(`select * from productpack`);
    return result.rows;
  }

  static async getPackDetailById(packId) {
    const detail = await db.query(
      `select * from productpack pack, packdetail detail, product p where pack.productpackid = detail.productpackid and detail.productid = p.productid and pack.productpackid = $1`,
      [packId]
    );

    if(!detail || !detail.rows || detail.rows.length < 1) {
        throw new NotFoundError("Cannot find this product pack id");
    }

    const result = {
      productpackid: detail.rows[0].productpackid,
      productpackname: detail.rows[0].productpackname,
      productpacklimit: detail.rows[0].productpacklimit,
      timeunit: detail.rows[0].timeunit,
    };

    result.products = detail.rows.map((product) => {
      product.productpackid = undefined;
      product.productpackname = undefined;
      product.productpacklimit = undefined;
      product.timeunit = undefined;
    });

    result.products = detail.rows;

    return result;
  }

  static async addPack({productpackname, productpacklimit, timeunit}, details)
  {
    const addPackResult = await db.query(
      `insert into productpack(productpackname, productpacklimit, timeunit, delete) 
      values($1, $2, $3, 0) returning productpackid`,
      [productpackname, productpacklimit, timeunit],
    )

    const productpackid = addPackResult.rows[0].productpackid;
    if(!productpackid)
    {
      return console.log("Something wrong while adding Pack");
    }

    details.forEach((detail) => {
      const {productid, quantity} = detail;
      const addDetailResult = await db.query(
        `insert into packdetail(productpackid, productid, quantity, delete) 
        values($1, $2, $3, 0)`,
        [productpackid, productid, quantity],
      )
    })

    return true;
  }

  static async updatePack({productpacklimit, timeunit}, detail, productpackid)
  {
    const result = await db.query(
      'update productpack set productpacklimit = $1, timeunit = $2 where productpackid = $3',
      [productpacklimit, timeunit, productpackid],
    )

    
  }
}

module.exports = ProductPack;
