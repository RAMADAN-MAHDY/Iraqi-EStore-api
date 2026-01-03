import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Example for Gmail
  port: 587,
  secure: false, // Use 'true' if your SMTP requires SSL/TLS (e.g., 465)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
  const { orderId, userInfo, address, total, itemsList, status } = orderDetails;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <h1>Order Confirmation</h1>
      <p>Dear ${userInfo.name},</p>
      <p>Your order #${orderId} has been ${status}.</p>
      <p><strong>Shipping Address:</strong> ${address}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <h2>Items:</h2>
      <ul>
        ${itemsList.map(item => `<li>${item.name} (x${item.qty}) - $${item.priceAtOrder.toFixed(2)} each</li>`).join('')}
      </ul>
      <p>Thank you for your purchase!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};