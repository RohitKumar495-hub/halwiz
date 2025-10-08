import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // ✅ link directly to Product collection
    required: true,
  },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  images: { type: [String], default: [] },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: {
      houseNumber: { type: String },
      street: { type: String },
      landmark: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    paymentMode: { type: String, enum: ["COD", "ONLINE"], required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "returned", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    returnReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
