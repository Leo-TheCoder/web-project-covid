const db = require("../db/connectDB");
const { NotFoundError, CustomError } = require("../errors");

class ProductPack {
  static async getPacks() {
    const result = await db.query(`select * from productpack where deleted = 0`);
    return result.rows;
  }

  static async getPackDetailById(packId) {
    const detail = await db.query(
      `select * from productpack pack, packdetail detail, product p, productpic pic 
      where pack.productpackid = detail.productpackid and detail.productid = p.productid and pack.productpackid = $1
      and detail.deleted = 0 and p.productid = pic.productid`,
      [packId]
    );

    if (!detail || !detail.rows || detail.rows.length < 1) {
      throw new NotFoundError("Cannot find this product pack id");
    }

    //Edit result object to make it easier to read
    const result = {
      productpackid: detail.rows[0].productpackid,
      productpackname: detail.rows[0].productpackname,
      productpacklimit: detail.rows[0].productpacklimit,
      timeunit: detail.rows[0].timeunit,
    };

    //get some common attribute out of the products array
    result.products = detail.rows.map((product) => {
      product.productpackid = undefined;
      product.productpackname = undefined;
      product.productpacklimit = undefined;
      product.timeunit = undefined;
    });

    result.products = detail.rows;

    return result;
  }

  static async addPack(
    { productpackname, productpacklimit, timeunit },
    details
  ) {
    //Add new row to productpack with returning id
    const addPackResult = await db.query(
      `insert into productpack(productpackname, productpacklimit, timeunit, deleted) 
      values($1, $2, $3, 0) returning productpackid`,
      [productpackname, productpacklimit, timeunit]
    );

    const productpackid = addPackResult.rows[0].productpackid;
    if (!productpackid) {
      return console.log("Something wrong while adding Pack");
    }

    //Add new details of product pack
    //Procedure insert_pack_detail will do the insert if not exists, update if exists
    const addDetailPromises = [];
    details.forEach(async (detail) => {
      const { productid, quantity } = detail;
      addDetailPromises.push(
        db.query(`call insert_pack_detail($1, $2, $3, $4)`, [
          productpackid,
          productid,
          quantity,
          0,
        ])
      );
    });

    //Waiting all promises of adding details
    const addDetailResult = Promise.all(addDetailPromises);
    if (!addDetailResult) {
      console.log("Something wrong when add pack detail");
      throw new CustomError("Something wrong when add pack detail");
    }

    return true;
  }

  static async updatePack(
    { productpacklimit, timeunit },
    details,
    productpackid
  ) {
    const result = await db.query(
      "update productpack set productpacklimit = $1, timeunit = $2 where productpackid = $3",
      [productpacklimit, timeunit, productpackid]
    );

    if (!result) {
      throw new CustomError("Some thing wrong when update product pack");
    }

    //Update all detail in productpack_detail
    //Procedure insert_pack_detail will do the insert if not exists, update if exists
    const updateDetailPromises = [];
    details.forEach(async (detail) => {
      const { productid, quantity, deleted} = detail;
      updateDetailPromises.push(
        db.query(`call insert_pack_detail($1, $2, $3, $4)`, [
          productpackid,
          productid,
          quantity,
          deleted,
        ])
      );
    });

    //Waiting all promises of updating details
    const updateDetailResult = Promise.all(updateDetailPromises);
    if (!updateDetailResult) {
      console.log("Something wrong when update pack detail");
      throw new CustomError("Something wrong when update pack detail");
    }

    return true;
  }

  static async deletePack(productpackid) {
    const deletePackPromise = db.query(
      `update productpack set deleted = 1 where productpackid = $1`,
      [productpackid]
    );
    const deleteDetailPackPromise = db.query(
      `update packdetail set deleted = 1 where productpackid = $1`,
      [productpackid],
    );
    
    const [deletePack, deleteDetail] = await Promise.all([deletePackPromise, deleteDetailPackPromise])

    if(deletePack.rowCount < 1) {
      throw new CustomError("Something wrong while deleting produck pack")
    }

    return true;
  }
}

module.exports = ProductPack;
