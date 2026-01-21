import PDFDocument from "pdfkit";

/**
 * Generate Invoice PDF as Buffer
 * @param {Object} order
 * @param {Object} user
 * @returns {Promise<Buffer>}
 */
const generateInvoicePdf = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // ===== HEADER =====
      doc
        .fontSize(20)
        .text("Dress Shop - Order Invoice", { align: "center" })
        .moveDown();

      // ===== ORDER INFO =====
      doc
        .fontSize(12)
        .text(`Order ID: ${order._id}`)
        .text(`Order Date: ${order.createdAt.toDateString()}`)
        .text(`Payment Status: ${order.paymentStatus}`)
        .moveDown();

      // ===== CUSTOMER INFO =====
      doc
        .fontSize(14)
        .text("Customer Details", { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text(`Name: ${user.name}`)
        .text(`Email: ${user.email}`)
        .text(`Phone: ${order.phone}`)
        .text(`Billing Address: ${order.billingAddress}`)
        .text(`Delivery Address: ${order.deliveryAddress}`)
        .moveDown();

      // ===== ITEMS TABLE HEADER =====
      doc
        .fontSize(14)
        .text("Order Items", { underline: true })
        .moveDown(0.5);

      doc.fontSize(12);

      order.items.forEach((item, index) => {
        doc
          .text(
            `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: ₹${item.price} | Total: ₹${item.totalPrice}`
          )
          .moveDown(0.3);
      });

      // ===== TOTAL =====
      doc.moveDown();
      doc
        .fontSize(14)
        .text(`Total Amount: ₹${order.totalAmount}`, {
          align: "right"
        });

      // ===== FOOTER =====
      doc.moveDown(2);
      doc
        .fontSize(10)
        .text(
          "Thank you for shopping with Dress Shop!",
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoicePdf;
