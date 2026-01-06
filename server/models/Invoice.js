const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    invoiceDate: Date,

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    billingAddress: Object,
    shippingAddress: Object,

    subtotal: Number,
    gstTotal: Number,
    grandTotal: Number,

    invoiceFile: String, // PDF filename

    status: {
      type: String,
      enum: ["GENERATED", "CANCELLED"],
      default: "GENERATED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
