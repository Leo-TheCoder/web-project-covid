const db = require("../db/connectDB");

class Product {
  static async getProducts() {
    const result = await db.query(`select * from product where deleted = 0`);

    return result.rows;
  }

  static async getProductById(productId) {
    const result = await db.query(
      `select * from product where productid = $1`,
      [productId]
    );

    return result.rows[0];
  }

  static async insertProduct({ productname, productprice, productunit }) {
    const result = await db.query(
      `insert into product (productname, productprice, productunit) 
      values($1, $2, $3)`,
      [productname, productprice, productunit]
    );

    return result.rowCount;
  }

  static async updateProduct({
    productid,
    productname,
    productprice,
    productunit,
  }) {
    const result = await db.query(
      `update product set productname = $1, productprice = $2, productunit = $3 where productid = $4`,
      [productname, productprice, productunit, productid]
    );

    return result.rowCount;
  }

  static async deleteProduct(productid)
  {
      const result = await db.query(
        `update product set deleted = 1 where productid = $1`,
        [productid],
      )
      return result.rowCount;
  }
}

module.exports = Product;
