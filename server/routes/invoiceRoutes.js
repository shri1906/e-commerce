const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyInvoices,
  getInvoiceById,
} = require("../controllers/invoiceController");

router.get("/my", auth, getMyInvoices);
router.get("/:id", auth, getInvoiceById);

module.exports = router;
