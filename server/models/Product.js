import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Skin Care",
        "Hand & Body",
        "Fragrance",
        "Home",
        "Hair",
        "Travel",
        "Gifts",
      ],
    },
    collectionGroup: {
      type: String,
      enum: ["catalog", "featured-kit", "curated-set"],
      default: "catalog",
    },
    badge: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    sizeLabel: { type: String, default: null },
    format: { type: String, default: null },
    variants: [variantSchema],
    skinType: [{ type: String }],
    skinConcern: [{ type: String }],
    form: { type: String, default: null },
    aroma: { type: String, default: null },
    ingredients: [{ type: String }],
    image: { type: String, required: true },
    hoverImage: { type: String, default: null },
    stock: { type: Number, default: 50, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);