import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Assuming you have a Product model
      required: true,
    },
    rating: {
      type: Number,
      default: null,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    description: {
      type: String,
      required: true, // just a plain required string
      trim: true,
      default : null
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
