const db = require("../db/connectDB");

class Order {
  static async getPersonalPatientOrders(patientid) {
    const result = await db.query(
      `select * from shoporder where patientid = $1`,
      [patientid]
    );

    return result.rows;
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
