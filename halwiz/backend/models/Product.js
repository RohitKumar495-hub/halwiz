import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String], // Array of Cloudinary image URLs
      default: [],
    },
  },
  { timestamps: true }
);

// ✅ Pre-save middleware: auto-calc discount percentage if not provided
productSchema.pre("save", function (next) {
  if (this.originalPrice && this.discountPrice) {
    this.discountPercent =
      Math.round(((this.originalPrice - this.discountPrice) / this.originalPrice) * 100);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
