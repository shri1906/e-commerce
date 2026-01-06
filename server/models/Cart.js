const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,          // snapshot
  price: Number,        // snapshot
  gstRate: Number,
  quantity: {
    type: Number,
    default: 1,
  },
  totalPrice: Number,
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [cartItemSchema],
    subtotal: Number,
    gstTotal: Number,
    grandTotal: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
