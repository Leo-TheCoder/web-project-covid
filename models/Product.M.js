const db = require("../db/connectDB");

class Product {
  static async getProducts() {
    const result = await db.query(`select p.*, l.linkpic from product p, productpic l where p.deleted = 0 and p.productid = l.productid`);

    return result.rows;
  }

  static async getProductById(productId) {
    const result = await db.query(
      `select p.* from product p where p.productid = $1`,
      [productId]
    );
    
    const picResult = await db.query(
      `select linkpic form productpic where productid = $1`,
      [productId],
    )

    const product = result.rows[0];
    product.linkpics = picResult.rows;

    return product;
  }

  static async insertProduct({ productname, productprice, productunit }, files) {
    const result = await db.query(
      `insert into product (productname, productprice, productunit) 
      values($1, $2, $3) returning productid`,
      [productname, productprice, productunit]
    );

    const productid = result.rows[0].productid;
    files.forEach(async element => {
      const filename = '/uploads/' + element.filename;
      await db.query(
        `insert into productpic(productid, linkpic) values($1, $2)`,
        [productid, filename],
      )
    });

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
