import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: "" },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    topics: [{ type: String }],
    reply: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);