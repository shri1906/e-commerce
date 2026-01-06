const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order, user) => {
  const invoiceName = `invoice_${order._id}.pdf`;
  const invoicePath = path.join(__dirname, "..", "invoices", invoiceName);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(invoicePath));

  // ===== HEADER =====
  doc
    .fontSize(20)
    .text("E-Commerce Invoice", { align: "center" })
    .moveDown();

  // ===== COMPANY INFO =====
  doc
    .fontSize(10)
    .text("Your Company Name")
    .text("Address Line 1")
    .text("GSTIN: XXXXXXXX")
    .moveDown();

  // ===== CUSTOMER INFO =====
  doc.text(`Invoice ID: ${order._id}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Customer: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.moveDown();

  // ===== TABLE HEADER =====
  doc.fontSize(12).text("Order Items", { underline: true }).moveDown(0.5);

  order.items.forEach((item, index) => {
    doc
      .fontSize(10)
      .text(
        `${index + 1}. ${item.name} | Qty: ${item.quantity} | ₹${item.price}`
      );
  });

  doc.moveDown();

  // ===== TOTAL =====
  doc
    .fontSize(12)
    .text(`Total Amount: ₹${order.totalAmount}`, { align: "right" })
    .moveDown();

  doc.text("Payment Mode: Cash On Delivery");
  doc.text("Order Status: Placed");

  // ===== FOOTER =====
  doc.moveDown(2);
  doc.fontSize(10).text("Thank you for shopping with us!", {
    align: "center",
  });

  doc.end();

  return invoiceName;
};

module.exports = generateInvoice;
