import nodemailer from "nodemailer";

/**
 * Send Order Confirmation Email with PDF Attachment
 * @param {string} toEmail
 * @param {Object} order
 * @param {Buffer} pdfBuffer
 */
const sendOrderEmail = async (toEmail, order, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: toEmail,
      subject: `Order Confirmation - ${order._id}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>${order._id}</strong> has been placed successfully.</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus}</p>
        <br/>
        <p>Please find your invoice attached.</p>
        <br/>
        <p>Regards,<br/>Dress Shop Team</p>
      `,
      attachments: [
        {
          filename: `Invoice-${order._id}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

export default sendOrderEmail;
