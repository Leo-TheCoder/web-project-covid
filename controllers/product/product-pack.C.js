const { StatusCodes } = require("http-status-codes");
const ProductPack = require("../../models/ProductPack.M");

const getProductPacks = async (req, res) => {
  const result = await ProductPack.getPacks();
  res.status(StatusCodes.OK).json(result);
};

const getProductPackById = async (req, res) => {
    const {packId} = req.params;
    const result = await ProductPack.getPackDetailById(packId);
    res.status(StatusCodes.OK).json(result);
}

const addProductPack = async (req, res) => {
  //pending
  //const result = await ProductPack.addPack()
}

module.exports = {
    getProductPacks,
    getProductPackById,
}