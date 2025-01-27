const express = require("express");
const Product = require("../models/product.model.js");
const router = express.Router();
const {
  getProducts,
  getProduct,
  creatProducts,
  updatedProduct,
  deleteProduct,
} = require("../controller/productController.js");

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", creatProducts);
router.put("/", updatedProduct);
router.delete("/", deleteProduct);

module.exports = router;
