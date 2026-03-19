import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, orders, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.find(),
      Order.countDocuments(),
    ]);

    const totalRevenue = orders.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0
    );

    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered"
    ).length;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "delivered"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

