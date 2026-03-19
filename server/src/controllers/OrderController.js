import Order from "../models/Order.js";
import User from "../models/User.js";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotificationEmail,
} from "../utils/emailService.js";

export const createOrder = async (req, res, next) => {
  try {
    const { items, totalPrice, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (totalPrice == null || Number(totalPrice) <= 0) {
      return res
        .status(400)
        .json({ message: "Valid total price is required" });
    }

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.addressLine ||
      !address.city ||
      !address.pincode
    ) {
      return res.status(400).json({
        message:
          "Address fullName, phone, addressLine, city and pincode are required",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      address,
      paymentMethod: "COD",
      status: "pending",
    });

    const user = await User.findById(req.user._id);

    let emailSent = false;
    try {
      await sendOrderConfirmationEmail({ user, order });
      emailSent = true;
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
    }

    try {
      await sendAdminOrderNotificationEmail({ user, order });
    } catch (error) {
      console.error("Failed to send admin order notification email:", error);
    }

    res.status(201).json({ order, emailSent, userEmail: user.email });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

