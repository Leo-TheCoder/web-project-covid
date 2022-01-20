const { StatusCodes } = require("http-status-codes");
const { CustomError, NotFoundError } = require("../../errors");
const Cart = require("../../models/Cart.M");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.M");
const Order = require("../../models/Order.M");

const addToCart = async (req, res) => {
  const result = await Cart.addToCart(req.body, req.patientid);

  if (!result) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Insert failed!",
      status: "Fail",
    });
  }

  return res.status(StatusCodes.OK).redirect("/packs");
};

const getItemsInCart = async (req, res) => {
  const result = await Cart.getItems(req.patientid);
  result.forEach((pack) => {
    let totalCash = 0.0;
    pack.products.forEach((product) => {
      product.cash =
        parseFloat(product.productprice) * parseInt(product.quantity);
      totalCash += product.cash;
    });
    pack.total = totalCash;
  });

  res.status(StatusCodes.OK).render("patients/cart/cart", {
    cart: result,
    editScript: () => "editcartscript",
    user: true,
  });
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
  const afterDelete = await Cart.getItems(req.patientid);

  if (!result || result < 1) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        msg: "Update failed!",
        status: "Fail",
      })
      .render("patients/cart/cart", {
        cart: afterDelete,
        editScript: () => "editcartscript",
        user: true,
      });
  }

  res
    .status(StatusCodes.OK)
    .json({
      msg: "Update successfully!",
      status: "Success",
    })
    .render();
};

const deletePackInCart = async (req, res) => {
  const { cartId } = req.params;
  const result = await Cart.deletePackInCart(cartId, req.patientid);

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

const pay = async (req, res) => {
  const { cartId } = req.params;
  const { total, details } = req.body;

  const user = await User.getInformation(req.user.mainId, "P");
  const url =
    req.protocol + "://" + req.get("host") + req.originalUrl + "/result";
  const iat = Date.now();
  try {
    const orderToken = jwt.sign(
      {
        iat: iat,
        iss: "vulong61@gmail.com",
        cus: user.patientphone,
        amt: total,
        msg: "Payment of cart id: " + cartId, //maybe u want to take cartId as attribute to return back
        cbu: url,
      },
      process.env.API_PAYMENT_KEY,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );

    return res.redirect(302, "http://localhost:5001/?orderToken=" + orderToken);
  } catch (err) {
    console.log(err);
  }
};

const payResult = async (req, res) => {
  //Get token from payment server
  const { token } = req.body;
  const { status, msg, tid } = jwt.verify(token, process.env.API_PAYMENT_KEY);

  if (status == 0) {
    
  } else {
    //Solve sumthing

    //Return item to order
    const {cartId} = req.params;
    const itemCart = await Cart.getItemById(cartId);
    const addToOrder = await Order.addOrder(itemCart, req.patientid);
    const deleteInCart = await Cart.deletePackInCart(cartId, req.patientid);

    //Show the result pay
    return res.send(itemCart);
  }
  return res.send();
};

module.exports = {
  addToCart,
  getItemsInCart,
  getItemById,
  updateItemQuantityInCart,
  deletePackInCart,
  pay,
  payResult,
};
