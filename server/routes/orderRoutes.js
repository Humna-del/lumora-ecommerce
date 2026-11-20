import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { orderSchema } from "../validators/storeValidator.js";

const router = express.Router();

router.post("/", protect, validate(orderSchema), createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;