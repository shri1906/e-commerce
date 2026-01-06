const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getMyProfile,
  updateProfile,
  addAddress,
  deleteAddress,
} = require("../controllers/userController");

router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateProfile);

router.post("/address", auth, addAddress);
router.delete("/address/:addressId", auth, deleteAddress);

module.exports = router;
