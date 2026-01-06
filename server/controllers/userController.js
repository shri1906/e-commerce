const User = require("../models/User");

// ================= GET MY PROFILE =================
exports.getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true }
  ).select("-password");

  res.json({ success: true, user });
};

// ================= ADD ADDRESS =================
exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses.push(req.body);
  await user.save();

  res.json({
    success: true,
    addresses: user.addresses,
  });
};

// ================= DELETE ADDRESS =================
exports.deleteAddress = async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );

  await user.save();
  res.json({ success: true, addresses: user.addresses });
};
