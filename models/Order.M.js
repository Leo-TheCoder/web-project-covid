const db = require("../db/connectDB");
const Photo = require('./Photo.M');

class Order {
  static async getPersonalPatientOrders(patientid) {
    const shopPromise = await db.query(
      `select s.* from shoporder s 
      where s.patientid = $1`,
      [patientid]
    );

    const shoporder = shopPromise.rows;

    await Promise.all(shoporder.map(async order => {
      const { orderid } = order;
      const detailPromise = await db.query(
        `select o.packid, o.productid, o.quantity, o.productprice, p.productname, p.productunit  
        from orderdetail o, product p 
        where o.orderid = $1 and p.productid = o.productid`,
        [orderid]
      );
      order.details = detailPromise.rows;
      const products = order.details;

      await Promise.all(products.map(async product => {
        const {productid} = product;
        const photoLinkpic = await Photo.getFirstPhoto(productid);
        product.linkpic = photoLinkpic;
      }))
    }))
    

    return shoporder;
  }

  static async getPatientOrders(managerid) {
    const result = await db.query(
      `select * from shoporder where managerid = $1`,
      [managerid]
    );

    return result.rows;
  }

  static async getOrderDetail(orderid) {
    let result;
    const overviewOrderResult = await db.query(
      `select * from shoporder where orderid = $1`,
      [orderid]
    );
    result = overviewOrderResult.rows[0];
    const detailOrderResult = await db.query(
      `select o.*, p.productname, p.productunit from orderdetail o, product p 
          where o.productid = p.productid and o.orderid = $1`,
      [orderid]
    );
    result.details = detailOrderResult.rows;

    return result;
  }
}

module.exports = Order;
