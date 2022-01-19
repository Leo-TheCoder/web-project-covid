const db = require("../db/connectDB");
const { CustomError } = require("../errors");

class Cart {
  static async addToCart({ productpackid, totalCash, products }, patientid) {
    try {
      const time = new Date().toDateString();
      const result_cart = await db.query(
        `insert into cart(patientid, total, updated_time) 
      values ($1, $2, $3::timestamp) returning cart_id`,
        [patientid, totalCash, time]
      );

      const cartid = result_cart.rows[0].cart_id;
      const productDetailPromises = [];
      products.forEach((product) => {
        productDetailPromises.push(
          db.query(
            `insert into cart_detail(cart_id, packid, productid, quantity, productprice) 
        values ($1, $2, $3, $4, $5)`,
            [
              cartid,
              productpackid,
              product.productid,
              product.quantity,
              product.cash,
            ]
          )
        );
      });
      await Promise.all(productDetailPromises);
      return cartid;
    } catch (error) {
      console.log(error);
      throw new CustomError("Something wrong while adding to cart");
    }
  }

  static async getItems(patientid) {
    const details = await db.query(
      `select c.*, d.quantity, p.productid, p.productname, p.productprice, min(pic.linkpic) as linkpic  
      from cart c, cart_detail d, product p, productpic pic 
      where c.patientid = $1 and c.cart_id = d.cart_id 
      and d.productid = p.productid and p.productid = pic.productid 
      group by c.cart_id, d.quantity, p.productid, p.productname, p.productprice 
      order by c.cart_id asc`,
      [patientid]
    );

    if (details.rowCount < 1) {
      return details.rows;
    }

    let result = [];
    let index = -1;
    const productDetails = [];
    details.rows.forEach((row, i) => {      
      const productDetail = {
        productid: row.productid,
        quantity: row.quantity,
        productname: row.productname,
        productprice: row.productprice,
        linkpic: row.linkpic,
      }

      productDetails.push(productDetail);
      delete row.productid;
      delete row.quantity;
      delete row.productname;
      delete row.productprice;
      delete row.linkpic;
    });
    const row = details.rows;
    for(let i = 0; i < row.length; i++) {
      if(index < 0 || row[i].cart_id !== result[index].cart_id) {
        result.push(row[i]);
        index++;
        result[index].products = [];
        result[index].products.push(productDetails[i]);
      }
      else
      {
        result[index].products.push(productDetails[i]);
      }
    }

    console.log(result);
    return result;
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

  static async deletePackInCart(cartId, patientid) {
    const deleteDetails = await db.query(
      `delete from cart_detail where cart_id = $1`,
      [cartId],
    )

    const result = await db.query(
      `delete from cart where cart_id = $1 and patientid = $2`,
      [cartId, patientid]
    );

    return result.rowCount;
  }
}

module.exports = Cart;
