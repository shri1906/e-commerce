const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

router.post("/place", auth, placeOrder);
router.get("/my", auth, getMyOrders);
router.get("/all", auth, getAllOrders); // admin use

module.exports = router;
