const { StatusCodes } = require("http-status-codes");
const { CustomError, NotFoundError } = require("../../errors");
const Cart = require("../../models/Cart.M");

const addToCart = async (req, res) => {
  const result = await Cart.addToCart(req.body, req.patientid);

  if (!result || result < 1) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Insert failed!",
      status: "Fail",
    });
  }

  res.status(StatusCodes.OK).json({
    msg: "Insert successfully!",
    status: "Success",
  });
};

const getItemsInCart = async (req, res) => {
  const result = await Cart.getItems(req.patientid);

  res.status(StatusCodes.OK).json({ result });
};

const getItemById = async (req, res) => {
  const { cartDetailId } = req.params;
  const result = await Cart.getItemById(req.patientid, cartDetailId);

  if (!result) {
    throw new NotFoundError("No item in cart with this id");
  }

  res.status(StatusCodes.OK).json({ result });
};

const updateItemQuantityInCart = async (req, res) => {
  const { cartDetailId } = req.params;

  const result = await Cart.updateItemQuantity(req.body, cartDetailId);

  if (!result || result < 1) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Update failed!",
      status: "Fail",
    });
  }

  res.status(StatusCodes.OK).json({
    msg: "Update successfully!",
    status: "Success",
  });
};

const deletePackInCart = async (req, res) => {
  const { packid } = req.body;

  const result = await Cart.deletePackInCart(packid, req.patientid);

  if (!result || result < 1) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Delete failed!",
      status: "Fail",
    });
  }

  res.status(StatusCodes.OK).json({
    msg: "Delete successfully!",
    status: "Success",
  });
};

module.exports = {
  addToCart,
  getItemsInCart,
  getItemById,
  updateItemQuantityInCart,
  deletePackInCart,
};
