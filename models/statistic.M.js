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

  static async getPatientOverTime() {
    try {
      const result = await db.query(
        `select * from R_NUMBER_OF_PATIENT_MONTH()`
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }

  static async getPatientOverYear() {
    try {
      const result = await db.query(
        `select * from R_NUMBER_OF_PATIENT_YEAR()`
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }

  static async getPatientOverDay() {
    try {
      const result = await db.query(
        `select * from R_NUMBER_OF_PATIENT_DAY()`
      );

      return result.rows;
    } catch (error) {
      return undefined;
    }
  }
}

module.exports = Statistic;
