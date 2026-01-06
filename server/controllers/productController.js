const Product = require("../models/Product");

// ================= CREATE PRODUCT (ADMIN) =================
exports.createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    image: req.file?.filename,
  });

  res.status(201).json({ success: true, product });
};

// ================= GET ALL PRODUCTS =================
exports.getProducts = async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
};

// ================= GET SINGLE PRODUCT =================
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  res.json(product);
};

// ================= UPDATE PRODUCT (ADMIN) =================
exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  res.json({ success: true, product: updated });
};

// ================= DELETE (SOFT) PRODUCT =================
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true });
};
