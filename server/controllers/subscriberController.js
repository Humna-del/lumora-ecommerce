import Subscriber from "../models/Subscriber.js";

// @desc    Save newsletter subscription
// @route   POST /api/subscribers
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to Lumora communications.",
      });
    }

    await Subscriber.create({ email, phone });
    res.status(201).json({
      success: true,
      message: "Thank you for subscribing to Lumora communications.",
    });
  } catch (err) {
    next(err);
  }
};