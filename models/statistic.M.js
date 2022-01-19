const db = require("../db/connectDB");

class Statistic {
  static async getProductConsumption() {
    try {
      const result = await db.query(
        `select * from public.r_product_consumption`
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }

  static async getPackSellQuantity() {
    try {
      const result = await db.query(
        `select * from public.r_pack_sell_quantity`
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }

}

module.exports = Statistic;
