import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderEmail = async (toEmail, order, pdfBuffer) => {
  try {
    await resend.emails.send({
      from: "JustBuy <onboarding@resend.dev>",
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
      attachments: pdfBuffer
        ? [
            {
              filename: `Invoice-${order._id}.pdf`,
              content: pdfBuffer.toString("base64"),
            },
          ]
        : [],
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

export default sendOrderEmail;
