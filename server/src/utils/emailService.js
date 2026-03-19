import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  ADMIN_EMAIL,
  NODE_ENV,
} = process.env;

let transporter;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
} else {
  console.log("No SMTP config found. Creating Ethereal test account...");
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Ethereal test account created for Nodemailer.");
  } catch (err) {
    console.error("Failed to create Ethereal test account. Email features will be disabled.", err.message);
  }
}

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    if (NODE_ENV !== "production") {
      console.warn("Email transporter is not configured. Skipping email send.");
    }
    return;
  }

  const from = FROM_EMAIL || SMTP_USER || '"Nirman Textile" <no-reply@nirmantextile.com>';

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  if (!SMTP_HOST) {
    console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
};

export const sendOrderConfirmationEmail = async ({ user, order }) => {
  if (!user?.email) return;

  const subject = "Order Confirmation - Nirman Textile";

  const itemsText = (order.items || [])
    .map(
      (item) =>
        `- ${item.name || item.productName || "Item"} x${
          item.qty || item.quantity || 1
        }`
    )
    .join("\n");

  const addr = order.address || order.shippingAddress || {};
  const addressLines = [
    addr.fullName,
    addr.phone,
    addr.addressLine || addr.street,
    addr.city,
    addr.pincode || addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const text = `
Dear ${user.name || "Customer"},

Thank you for shopping with Nirman Textile.

Your order has been placed successfully.

Order ID: ${order._id}
Total: ₹${order.totalPrice}

Items:
${itemsText || "See order details in your account."}

Shipping Address:
${addressLines || "See order details in your account."}

Payment Method: ${order.paymentMethod || "Cash on Delivery"}

We will notify you when your order is processed.

Best regards,
Nirman Textile
`.trim();

  const html = `
<p>Dear ${user.name || "Customer"},</p>
<p>Thank you for shopping with <strong>Nirman Textile</strong>.</p>
<p>Your order has been placed successfully.</p>
<ul>
  <li><strong>Order ID:</strong> ${order._id}</li>
  <li><strong>Total:</strong> ₹${order.totalPrice}</li>
  <li><strong>Payment Method:</strong> ${
    order.paymentMethod || "Cash on Delivery"
  }</li>
</ul>
<p><strong>Items:</strong></p>
<ul>
  ${
    order.items && order.items.length
      ? order.items
          .map(
            (item) =>
              `<li>${item.name || item.productName || "Item"} x${
                item.qty || item.quantity || 1
              }</li>`
          )
          .join("")
      : "<li>See order details in your account.</li>"
  }
</ul>
<p><strong>Shipping Address:</strong><br/>${
    addressLines || "See order details in your account."
  }</p>
<p>We will notify you when your order is processed.</p>
<p>Best regards,<br/>Nirman Textile</p>
`.trim();

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

export const sendAdminOrderNotificationEmail = async ({ user, order }) => {
  const adminEmail = ADMIN_EMAIL || "admin@nirmantextile.com";
  if (!adminEmail) return;

  const subject = `New order received: ${order._id}`;

  const itemsText = (order.items || [])
    .map(
      (item) =>
        `- ${item.name || item.productName || "Item"} x${
          item.qty || item.quantity || 1
        }`
    )
    .join("\n");

  const addr = order.address || order.shippingAddress || {};
  const addressLines = [
    addr.fullName,
    addr.phone,
    addr.addressLine || addr.street,
    addr.city,
    addr.pincode || addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const text = `
New order received on Nirman Textile.

Order ID: ${order._id}
Customer: ${user.name || "N/A"} (${user.email || "N/A"})
Total: ₹${order.totalPrice}

Items:
${itemsText || "See admin panel for full details."}

Shipping Address:
${addressLines || "See admin panel for full details."}

Payment Method: ${order.paymentMethod || "Cash on Delivery"}
Status: ${order.status || "pending"}
`.trim();

  const html = `
<p><strong>New order received on Nirman Textile.</strong></p>
<ul>
  <li><strong>Order ID:</strong> ${order._id}</li>
  <li><strong>Customer:</strong> ${user.name || "N/A"} (${
    user.email || "N/A"
  })</li>
  <li><strong>Total:</strong> ₹${order.totalPrice}</li>
  <li><strong>Payment Method:</strong> ${
    order.paymentMethod || "Cash on Delivery"
  }</li>
  <li><strong>Status:</strong> ${order.status || "pending"}</li>
</ul>
<p><strong>Items:</strong></p>
<ul>
  ${
    order.items && order.items.length
      ? order.items
          .map(
            (item) =>
              `<li>${item.name || item.productName || "Item"} x${
                item.qty || item.quantity || 1
              }</li>`
          )
          .join("")
      : "<li>See admin panel for full details.</li>"
  }
</ul>
<p><strong>Shipping Address:</strong><br/>${
    addressLines || "See admin panel for full details."
  }</p>
`.trim();

  await sendEmail({
    to: adminEmail,
    subject,
    text,
    html,
  });
};

