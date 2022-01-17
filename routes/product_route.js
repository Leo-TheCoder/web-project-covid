const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads');
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({storage: storage});
const multipleUpload = upload.fields([{name: 'image', maxCount: 4}]);

const {
  getProducts,
  insertProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addProduct,
} = require("../controllers/product/product.C");

router.route("/").get(getProducts).post(multipleUpload, insertProduct);
router.route("/add").get(addProduct);
router
  .route("/:productId")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
