const { StatusCodes } = require("http-status-codes");
const Product = require("../../models/Product.M");

const getProducts = async (req, res) => {
  const result = await Product.getProducts();
  res.status(StatusCodes.OK).render("products/products", {
		products: result,
		user: true,
	});
};

const getProductById = async (req, res) => {
  const { productId } = req.params;

  const result = await Product.getProductById(productId);
  res.status(StatusCodes.OK).render("products/edit", {
		product: result,
    productid: productId,
    editScript: () => "editproductscript",
		user: true,
  });
};

//UI only
const addProduct = (req, res) => {
  res.render("products/addnew", {
    editScript: () => "editproductscript",
		user: true,
  });
}

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
  
  const result = await Product.deleteProduct(productId);

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
  getProducts,
  getProductById,
  insertProduct,
  updateProduct,
  deleteProduct,
  addProduct,
};
