const Invoice = require("../models/Invoice");

exports.getMyInvoices = async (req, res) => {
  const invoices = await Invoice.find()
    .populate({
      path: "orderId",
      match: { user: req.user.id },
    })
    .sort({ createdAt: -1 });

  res.json(invoices.filter(i => i.orderId));
};

exports.getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("orderId");

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(invoice);
};
