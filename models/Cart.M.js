const db = require("../db/connectDB");

class Cart {
  static async addToCart(
    { packid, productid, quantity, productprice },
    patientid
  ) {
    const result = await db.query(
      `insert into cart_detail(patientid, packid, productid, quantity, productprice) values ($1, $2, $3, $4, $5)`,
      [patientid, packid, productid, quantity, productprice]
    );

    return result.rowCount;
  }

  static async getItems(patientid) {
    const result = await db.query(
      `select * from cart_detail c, product p where patientid = $1 and c.productid = p.productid`,
      [patientid]
    );

    return result.rows;
  }

  static async getItemById(patientid, cart_detail_id) {
    const result = await db.query(
      `select * from cart_detail c, product p where c.cart_detail_id = $1 and c.patientid = $2 and c.productid = p.productid`,
      [cart_detail_id, patientid]
    );

    return result.rows[0];
  }

  static async updateItemQuantity({ quantity }, cart_detail_id) {
    const result = await db.query(
      "update cart_detail set quantity = $1 where cart_detail_id = $2",
      [quantity, cart_detail_id]
    );

    return result.rowCount;
  }

  static async deleteItemInCart(cart_detail_id) {
    const result = await db.query(
      `delete from cart_detail where cart_detail_id = $1`,
      [cart_detail_id]
    );

    return result.rowCount;
  }
}

module.exports = Cart;
