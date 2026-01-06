const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const User = require("../models/User");
const generateInvoice = require("../utils/generateInvoice");

exports.placeOrder = async (req, res) => {
  try {
    const {
      items,
      billingAddress,
      shippingAddress
    } = req.body;

    let subtotal = 0;
    let gstTotal = 0;

    const orderItems = items.map((item) => {
      const gstAmount =
        (item.price * item.quantity * item.gstRate) / 100;
      const totalPrice = item.price * item.quantity + gstAmount;

      subtotal += item.price * item.quantity;
      gstTotal += gstAmount;

      return {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        gstRate: item.gstRate,
        gstAmount,
        totalPrice,
      };
    });

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      billingAddress,
      shippingAddress,
      subtotal,
      gstTotal,
      totalAmount: subtotal + gstTotal,
      paymentMode: "COD",
    });

    // ===== INVOICE CREATION =====
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceDate: new Date(),
      orderId: order._id,
      billingAddress,
      shippingAddress,
      subtotal,
      gstTotal,
      grandTotal: subtotal + gstTotal,
    });

    const user = await User.findById(req.user.id);

    const invoiceFile = generateInvoice(order, invoice, user);
    invoice.invoiceFile = invoiceFile;
    await invoice.save();

    order.invoice = invoice._id;
    await order.save();

    res.status(201).json({
      success: true,
      orderId: order._id,
      invoiceId: invoice._id,
      invoiceUrl: `/invoices/${invoiceFile}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("invoice")
    .sort({ createdAt: -1 });

  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("invoice");

  res.json(orders);
};
