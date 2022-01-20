const db = require("../db/connectDB");
const { NotFoundError, CustomError } = require("../errors");

class ProductPack {
  static async getPacks(sortby) {
    if(sortby) {
      const attributeSort = sortby.split("-")[0];
      const isAscend = sortby.split("-")[1] === "a" ? true : false;

      let query = `select pack.*, min(p.linkpic) as linkpic from productpack pack, packdetail d, productpic p   
      where pack.deleted = 0 and pack.productpackid = d.productpackid and d.productid = p.productid 
	    group by pack.productpackid 
      order by ${attributeSort} `;

      if (isAscend) {
        query += "asc";
      } else {
        query += "desc";
      }

      const result = await db.query(query);

      result.rows.forEach(pack => {
        
      })

      return result.rows;
    }
    else {
      const result = await db.query(
        `select pack.*, min(p.linkpic) as linkpic from productpack pack, packdetail d, productpic p   
        where pack.deleted = 0 and pack.productpackid = d.productpackid and d.productid = p.productid
        group by pack.productpackid;`
      );
      return result.rows;
    }
  }

  static async searchPackByName(name, sortby) {
    if(sortby) {
      const attributeSort = sortby.split("-")[0];
      const isAscend = sortby.split("-")[1] === "a" ? true : false;

      let query = `select * from productpack where deleted = 0 and lower(productpackname) = $1
      order by ${attributeSort} `;

      if (isAscend) {
        query += "asc";
      } else {
        query += "desc";
      }

      const result = await db.query(query, ['%' + name + '%']);
      return result.rows;
    }
      else {
        const result = await db.query(
          `select * from productpack where deleted = 0 and lower(productpackname) = $1`,
          ['%' + name + '%'],
        );

        return result.rows;
      }
  }

  static async getNumberOfPackAvaliableForPatient(patientid, packid, timeunit) {
    const result = await db.query(
      `select count_number_of_packs_ordered_in_timeunit($1, $2, $3) as count_packs`,
      [parseInt(patientid), parseInt(packid), parseInt(timeunit)], 
    )

    return result.rows[0].count_packs;
  }

  static async getPackDetailById(packId) {
    const detail = await db.query(
      `select * from productpack pack, packdetail detail, product p 
      where pack.productpackid = detail.productpackid and detail.productid = p.productid and pack.productpackid = $1
      and detail.deleted = 0 and p.deleted = 0`,
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
    result.products = detail.rows.forEach((product) => {
      delete product.productpackid;
      delete product.productpackname;
      delete product.productpacklimit;
      delete product.timeunit;
    });

    result.products = detail.rows;

    //Get link pictures
    const linkPics = [];
    const pictureResult = await db.query(
      `select p.linkpic from packdetail pack, productpic p 
      where pack.productid = p.productid and pack.productpackid = $1`,
      [packId]
    )
    
    pictureResult.rows.forEach(element => {
      linkPics.push(element.linkpic);
    })

    result.linkpics = linkPics;
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
      const { productid, quantity, deleted } = detail;
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
      [productpackid]
    );

    const [deletePack, deleteDetail] = await Promise.all([
      deletePackPromise,
      deleteDetailPackPromise,
    ]);

    if (deletePack.rowCount < 1) {
      throw new CustomError("Something wrong while deleting produck pack");
    }

    return true;
  }
}

module.exports = ProductPack;
