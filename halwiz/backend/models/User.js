import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Address Schema
const addressSchema = new mongoose.Schema(
  {
    houseNumber: { type: String, default: '' },
    street: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },
  { _id: true }
);

// Testimonial Schema
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// User Schema
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, default: () => uuidv4() },
    password: { type: String, required: true, select: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    token: { type: String },
    phoneNumber: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    addresses: { type: [addressSchema], default: [] },

    // Cart Items
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 0 },
      },
    ],

    // Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // ✅ Testimonials added
    testimonials: { type: [testimonialSchema], default: [] },
  },
  { timestamps: true }
);

// Generate JWT
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString(), isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '365d' }
  );
  this.token = token;
  await this.save();
  return token;
};

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
