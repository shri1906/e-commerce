const Cart = require("../models/Cart");
const Product = require("../models/Product");

// 🔁 Recalculate totals
const calculateTotals = (items) => {
  let subtotal = 0;
  let gstTotal = 0;

  items.forEach((item) => {
    const gstAmount = (item.price * item.quantity * item.gstRate) / 100;
    item.totalPrice = item.price * item.quantity + gstAmount;

    subtotal += item.price * item.quantity;
    gstTotal += gstAmount;
  });

  return {
    subtotal,
    gstTotal,
    grandTotal: subtotal + gstTotal,
  };
};

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const existingItem = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      gstRate: product.gstRate,
      quantity,
    });
  }

  Object.assign(cart, calculateTotals(cart.items));
  await cart.save();

  res.json({ success: true, cart });
};

// ================= GET MY CART =================
exports.getMyCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  res.json(cart || { items: [], subtotal: 0, gstTotal: 0, grandTotal: 0 });
};

// ================= UPDATE QUANTITY =================
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = quantity;

  cart.items = cart.items.filter((i) => i.quantity > 0);
  Object.assign(cart, calculateTotals(cart.items));

  await cart.save();
  res.json({ success: true, cart });
};

// ================= REMOVE ITEM =================
exports.removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.json({ success: true });

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== req.params.productId
  );

  Object.assign(cart, calculateTotals(cart.items));
  await cart.save();

  res.json({ success: true, cart });
};

// ================= CLEAR CART =================
exports.clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json({ success: true });
};
