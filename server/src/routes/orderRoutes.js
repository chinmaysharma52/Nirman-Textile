import express from "express";
import { createOrder, getMyOrders } from "../controllers/OrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

export default router;

