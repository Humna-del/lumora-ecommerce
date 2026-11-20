import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create a new order (prices calculated strictly on server!)
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      deliveryMethod,
      shippingAddress,
      items,
      samples,
      giftOptions,
      promoCode,
      paymentMethod,
    } = req.body;

    if (
      deliveryMethod === "delivery" &&
      (!shippingAddress.street || !shippingAddress.city || !shippingAddress.country)
    ) {
      res.status(400);
      return next(new Error("Please provide your complete shipping address."));
    }

    let subtotal = 0;
    const verifiedItems = [];

    // Verify each product & variant against MongoDB
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        res.status(400);
        return next(new Error("Invalid product in cart."));
      }

      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        res.status(404);
        return next(new Error("One of the products in your cart was not found."));
      }

      if (dbProduct.stock < item.quantity) {
        res.status(400);
        return next(new Error(`Insufficient stock for ${dbProduct.name}.`));
      }

      // Check variant price + optional 10% subscription discount
      const isSub = item.selectedVariant.endsWith(" (Subscription)");
      const baseLabel = isSub
        ? item.selectedVariant.replace(" (Subscription)", "")
        : item.selectedVariant;

      const matchedVariant = dbProduct.variants?.find(
        (v) => v.label === baseLabel
      );
      let unitPrice = matchedVariant ? matchedVariant.price : dbProduct.price;
      if (isSub) {
        unitPrice = Number((unitPrice * 0.9).toFixed(2));
      }

      subtotal += unitPrice * item.quantity;

      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        selectedVariant: item.selectedVariant || dbProduct.format || "Standard",
        quantity: item.quantity,
        unitPrice,
        image: dbProduct.image,
      });

      // Deduct stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    subtotal = Number(subtotal.toFixed(2));

    // Server-side promo & shipping calculation
    const cleanPromo = promoCode ? promoCode.toUpperCase() : null;
    const discount =
      cleanPromo === "LUMORA15" ? Number((subtotal * 0.15).toFixed(2)) : 0;
    const shippingFee =
      deliveryMethod === "pickup" || subtotal >= 75 ? 0 : 8;
    const totalAmount = Number(
      Math.max(0, subtotal - discount + shippingFee).toFixed(2)
    );

    const order = await Order.create({
      user: req.user?._id || null,
      customerName,
      customerEmail,
      deliveryMethod,
      shippingAddress,
      items: verifiedItems,
      samples,
      giftOptions,
      promoCode: discount > 0 ? cleanPromo : null,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "card-sandbox" ? "paid" : "pending",
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in user's order history
// @route   GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order receipt
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }

    // If order belongs to a registered user, enforce ownership
    if (
      order.user &&
      (!req.user ||
        (order.user.toString() !== req.user._id.toString() &&
          req.user.role !== "admin"))
    ) {
      res.status(403);
      return next(new Error("Not authorized to view this order."));
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};