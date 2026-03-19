import express from "express";
import {
  getStats,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getStats);
router.get("/orders", protect, admin, getAllOrders);
router.patch("/orders/:id/status", protect, admin, updateOrderStatus);

export default router;

