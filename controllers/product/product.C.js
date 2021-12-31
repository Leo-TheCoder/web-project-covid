const { StatusCodes } = require("http-status-codes");
const Product = require("../../models/Product.M");

const getProducts = async (req, res) => {
  const reuslt = await Product.getProducts();
  res.status(StatusCodes.OK).json(reuslt);
};

const getProductById = async (req, res) => {
  const { productId } = req.params;

  const result = await Product.getProductById(productId);
  res.status(StatusCodes.OK).json(result);
};

const insertProduct = async (req, res) => {
  const result = await Product.insertProduct(req.body);

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

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  req.body.productid = productId;
  const result = await Product.updateProduct(req.body);

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

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  res.status(StatusCodes.OK).send("Can ban bac lai vu xoa san pham nha!");
};

module.exports = {
  getProducts,
  getProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
};
