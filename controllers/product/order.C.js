/** @format */

const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../../errors");
const Order = require("../../models/Order.M");

const getPatientOrders = async (req, res) => {
  let result;
  if (req.user.type === "P") {
    result = await Order.getPersonalPatientOrders(req.user.mainId);
  } else if (req.user.type === "M") {
    result = await Order.getPatientOrders(req.user.mainId);
  }

  if (!result) {
    throw new CustomError("Something wrong with get list Order");
  }

  res.render("products/orderhistory", {
    orders: result,
    user: true,
  });
};

const getOrderDetail = async (req, res) => {
  const { orderId } = req.params;

  const result = await Order.getOrderDetail(orderId);

  if (!result) {
    throw new CustomError("Something wrong with get order detail");
  }

  res.status(StatusCodes.OK).json({ result });
};

const addOrder = async (req, res) => {
  const result = await Order.addOrder(req.body, req.patientid);

  if (!result) {
    throw new CustomError("Something wrong while adding to Order");
  }

  return res.status(StatusCodes.OK).json({
	  msg: "Add to Order successfully",
	  status: "Success"
  })
};

module.exports = {
  getPatientOrders,
  getOrderDetail,
  addOrder,
};
