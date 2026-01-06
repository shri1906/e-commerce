const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

router.get("/", auth, getMyCart);
router.post("/add", auth, addToCart);
router.put("/update", auth, updateCartItem);
router.delete("/remove/:productId", auth, removeCartItem);
router.delete("/clear", auth, clearCart);

module.exports = router;
