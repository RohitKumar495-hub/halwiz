import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Rating from "../models/Rating.js";

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newUser = await User.create({
    userId: uuidv4(), // generate unique userId
    username: email.split('@')[0],
    password,
    email,
    name
  });

  const token = await newUser.generateAuthToken();

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    userId: newUser.userId, // return the generated userId
    token,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  // ✅ Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'No user found with this email',
    });
  }

  // ✅ Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // ✅ Generate JWT
  const token = await user.generateAuthToken();

  // ✅ Send proper response including isAdmin
  res.json({
    success: true,
    message: 'Login successful',
    token,
    userId: user._id,       // ✅ correct field
    isAdmin: user.isAdmin,  // ✅ add this line
  });
});

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cartItems.product', // populate product info
        select: 'name discountPrice' // only required fields
      })
      .populate('addresses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      user,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};


export const sendWhatsAppOtp = catchAsync(async (req, res) => {
  let { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number is required',
    });
  }

  // Accept plain 10-digit number only
  const cleanedNumber = mobileNumber.replace(/\D/g, '');
  if (cleanedNumber.length !== 10) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number must be 10 digits',
    });
  }

  const formattedNumber = cleanedNumber;

  const url = `${process.env.MESSAGECENTRAL_BASE_URL}?countryCode=91&customerId=${process.env.MESSAGECENTRAL_CUSTOMER_ID}&flowType=WHATSAPP&mobileNumber=${formattedNumber}`;

  try {
    const response = await axios.post(url, null, {
      headers: {
        authToken: process.env.MESSAGECENTRAL_AUTH_TOKEN,
      },
    });

    // Extract verificationId from provider response
    const verificationId =
      response.data?.data?.verificationId || response.data?.verificationId;

    if (!verificationId) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get verificationId from provider',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully via WhatsApp',
      data: {
        verificationId,
        mobileNumber: formattedNumber,
      },
    });
  } catch (error) {
    console.error('OTP sending failed:', error.response?.data || error.message);

    // Handle case where OTP request already exists
    const verificationIdFromError = error.response?.data?.data?.verificationId;
    if (verificationIdFromError) {
      return res.status(200).json({
        success: true,
        message: 'OTP already sent, using existing verificationId',
        data: {
          verificationId: verificationIdFromError,
          mobileNumber: formattedNumber,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.response?.data || error.message,
    });
  }
});


export const verifyWhatsAppOtp = catchAsync(async (req, res) => {
  let { mobileNumber, verificationId, code } = req.body;

  if (!mobileNumber || !code) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number and OTP code are required',
    });
  }

  const cleanedNumber = mobileNumber.replace(/\D/g, '');
  if (cleanedNumber.length !== 10) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number must be 10 digits',
    });
  }

  const formattedNumber = `+91${cleanedNumber}`;

  // verificationId is optional, but required for provider request
  if (!verificationId) {
    return res.status(400).json({
      success: false,
      message: 'verificationId is required. Please request a new OTP.',
    });
  }

  const url = `${process.env.MESSAGECENTRAL_VALIDATE_URL}?countryCode=91&mobileNumber=${formattedNumber}&verificationId=${verificationId}&customerId=${process.env.MESSAGECENTRAL_CUSTOMER_ID}&code=${code}`;

  try {
    const response = await axios.get(url, {
      headers: { authToken: process.env.MESSAGECENTRAL_AUTH_TOKEN },
    });

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not logged in',
      });
    }

    await User.findByIdAndUpdate(req.user._id, { phoneNumber: formattedNumber });

    return res.status(200).json({
      success: true,
      message: 'OTP verified and phone number updated successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('OTP verification failed:', error.response?.data || error.message);

    // Handle expired/invalid verificationId
    if (error.response?.data?.responseCode === 506) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verificationId. Please resend OTP.',
        data: error.response.data.data,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: error.response?.data || error.message,
    });
  }
});


export const addAddress = catchAsync(async (req, res) => {
  const { houseNumber, street, landmark, city, state, pincode } = req.body;

  // ✅ Ensure user is logged in
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: User not logged in',
    });
  }

  // ✅ Validate at least one field is provided
  if (!houseNumber && !street && !landmark && !city && !state && !pincode) {
    return res.status(400).json({
      success: false,
      message: 'At least one address field must be provided',
    });
  }

  try {
    // ✅ Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ✅ Create new address
    const newAddress = {
      houseNumber: houseNumber || '',
      street: street || '',
      landmark: landmark || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
    };

    // ✅ Push new address to addresses array
    user.addresses.push(newAddress);

    await user.save();

    // ✅ Get the last added address (with its _id)
    const addedAddress = user.addresses[user.addresses.length - 1];

    return res.status(200).json({
      success: true,
      message: 'Address added successfully',
      data: addedAddress, // return only the newly added address with _id
    });
  } catch (error) {
    console.error('Adding address failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Adding address failed',
      error: error.message,
    });
  }
});

export const deleteAddress = catchAsync(async (req, res) => {
  const { addressId } = req.body; // ✅ Get addressId from request body

  // ✅ Ensure user is logged in
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: User not logged in',
    });
  }

  if (!addressId) {
    return res.status(400).json({
      success: false,
      message: 'addressId is required in the request body',
    });
  }

  try {
    // ✅ Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ✅ Filter out the address to delete
    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    if (user.addresses.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses, // return updated addresses
    });
  } catch (error) {
    console.error('Deleting address failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Deleting address failed',
      error: error.message,
    });
  }
});

// Return an order with reason
export const returnOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body; // User must provide reason

    if (!orderId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Order ID and return reason are required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure the logged-in user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to return this order",
      });
    }

    // Update order status and store user-provided reason
    order.status = "returned";
    order.returnReason = reason; 
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order has been returned successfully",
      order,
    });
  } catch (error) {
    console.error("Return order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to return order",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      orders: orders || [], // always return array
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};


export const createOrder = async (req, res) => {
  try {
    const { items, addressIndex, paymentMode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    // 🔍 Find logged-in user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.addresses || user.addresses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No address found. Please add an address before placing an order.",
      });
    }

    if (
      typeof addressIndex !== "number" ||
      addressIndex < 0 ||
      addressIndex >= user.addresses.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid address index",
      });
    }

    const chosenAddress = user.addresses[addressIndex];

    // 🛒 Build order items
    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      // ✅ Check stock
      if (item.quantity > product.quantity) {
        return res.status(400).json({
          success: false,
          message: `Oh Sorry! Product "${product.name}" is out of stock. Try another product.`,
        });
      }

      const priceToUse = product.discountPrice || product.originalPrice;

      // Calculate subtotal
      const subtotal = priceToUse * item.quantity;
      totalPrice += subtotal;

      // Handle chosen images
      let chosenImages = [];
      if (item.imageIndexes && item.imageIndexes.length > 0) {
        chosenImages = item.imageIndexes
          .map((i) => product.images[i])
          .filter((img) => img);
      }

      // ✅ Push productId into order item
      orderItems.push({
        productId: product._id,   // ✅ Added productId reference
        productName: product.name,
        quantity: item.quantity,
        originalPrice: priceToUse,
        images: chosenImages,
      });
    }

    // ✅ Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    // ✅ Create order
    const newOrder = new Order({
      items: orderItems,
      customerName: user.name,
      customerPhone: user.phoneNumber,
      address: chosenAddress,
      user: user._id,
      userId: user.userId,
      paymentMode: paymentMode || "COD",
      totalPrice: totalPrice,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body; // pass orderId in request body

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Optional: Ensure logged-in user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order has been cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

export const addRating = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { productId, rating, description } = req.body;

    // ✅ Validate required fields
    if (!productId || !description) {
      return res.status(400).json({
        success: false,
        message: "ProductId and description are required",
      });
    }

    // ✅ Ensure product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Check if user purchased this product
    const purchased = await Order.findOne({
      user: userId,
      "items.productId": productId, // depends on how you store order items
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "You can only rate products you have purchased",
      });
    }

    // ✅ Prevent duplicate rating by same user
    const existingRating = await Rating.findOne({ userId, productId });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You already rated this product",
      });
    }

    // ✅ Create new rating
    const newRating = await Rating.create({
      userId,
      productId,
      rating: rating ?? null,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Rating added successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Add rating error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add rating",
      error: error.message,
    });
  }
};

export const addOrUpdateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body; // no need for quantity from frontend

    const user = await User.findById(userId);

    const existingItem = user.cartItems.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += 1; // increment if already exists
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
    }

    await user.save();

    // populate product for frontend convenience
    const populatedUser = await User.findById(userId).populate('cartItems.product');

    res.status(200).json({ success: true, cartItems: populatedUser.cartItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const user = await User.findById(userId);

    const itemIndex = user.cartItems.findIndex(item => item.product.toString() === productId);

    if (itemIndex !== -1) {
      if (user.cartItems[itemIndex].quantity > 1) {
        user.cartItems[itemIndex].quantity -= 1;
        user.markModified('cartItems'); // ✅ ensure Mongoose detects change
      } else {
        user.cartItems.splice(itemIndex, 1); // remove if quantity is 1
      }
    }

    await user.save();

    const populatedUser = await User.findById(userId).populate('cartItems.product');

    res.status(200).json({ success: true, cartItems: populatedUser.cartItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const user = await User.findById(userId);

    if (user.wishlist.includes(productId)) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCartAndWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate('cartItems.product')
      .populate('wishlist');

    res.status(200).json({ 
      success: true,
      cartItems: user.cartItems,
      wishlist: user.wishlist 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user and populate cart items
    const user = await User.findById(userId).populate('cartItems.product');

    res.status(200).json({
      success: true,
      cartItems: user.cartItems.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        images: item.product.images,
        originalPrice: item.product.originalPrice,
        discountPrice: item.product.discountPrice,
        discountPercent: item.product.discountPercent,
        quantity: item.quantity,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeItemCompletely = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter out the product completely
    user.cartItems = user.cartItems.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.cartItems = []; // clear cart safely
    await user.save();

    res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// =====================
// Add Testimonial
// =====================
export const addTestimonial = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const newTestimonial = { name, description };
    user.testimonials.push(newTestimonial);

    await user.save();
    res.status(201).json({ success: true, data: newTestimonial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =====================
// Update Testimonial
// =====================
export const updateTestimonial = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { testimonialId } = req.params;
    const { name, description } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const testimonial = user.testimonials.id(testimonialId);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found." });

    if (name) testimonial.name = name;
    if (description) testimonial.description = description;

    await user.save();
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// =====================
// Get All Testimonials (Admin)
// =====================
export const getAllTestimonials = async (req, res) => {
  try {
    const users = await User.find({ "testimonials.0": { $exists: true } }, { testimonials: 1, name: 1, email: 1 });
    const allTestimonials = users.flatMap(user =>
      user.testimonials.map(t => ({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        testimonialId: t._id,
        name: t.name,
        description: t.description,
        createdAt: t.createdAt
      }))
    );

    res.status(200).json({ success: true, data: allTestimonials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// admin controllers

export const getAllUsersByAdmin = catchAsync(async (req, res) => {
  // ✅ Ensure logged-in user
  if (!req.user?._id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User not logged in",
    });
  }

  try {
    // ✅ Check if logged-in user is admin
    const adminUser = await User.findById(req.user._id);
    if (!adminUser?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admins only",
      });
    }

    // ✅ Fetch users but exclude password & token
    const users = await User.find().select("-password -token");

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      totalUsers: users.length, // ✅ Total number of users
      data: users,
    });
  } catch (error) {
    console.error("Fetching all users failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Fetching all users failed",
      error: error.message,
    });
  }
});

export const createProduct = async (req, res) => {
  try {
    // ✅ Verify logged-in user is admin
    const currentUser = await User.findById(req.user._id);
    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create products",
      });
    }

    const {
      name,
      quantity,
      originalPrice,
      discountPercent = 0, // default to 0
      description,
      category,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !quantity || !originalPrice || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, quantity, price, category and description are required",
      });
    }

    let imageUrls = [];

    // ✅ Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        return cloudinary.uploader.upload(base64Image, { folder: "products" });
      });

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.secure_url);
    }

    // ✅ Require at least one image
    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // ✅ Calculate discountPrice from discountPercent
    const numericOriginalPrice = Number(originalPrice);
    const numericDiscountPercent = Number(discountPercent);

    const discountPrice = Math.round(
      numericOriginalPrice - (numericOriginalPrice * numericDiscountPercent) / 100
    );

    // ✅ Save product in DB
    const product = new Product({
      name,
      quantity: Number(quantity),
      originalPrice: numericOriginalPrice,
      discountPercent: numericDiscountPercent,
      discountPrice,
      description,
      category,
      images: imageUrls,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // ✅ Verify logged-in user is admin
    const currentUser = await User.findById(req.user._id);
    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete products",
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required in request body",
      });
    }

    // ✅ Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can update products" });
    }

    const { _id, name, quantity, originalPrice, discountPrice, discountPercent, description, category, existingImages } = req.body;

    if (!_id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let remainingImages = [];
    if (existingImages) {
      remainingImages = JSON.parse(existingImages);
    }

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        return cloudinary.uploader.upload(base64Image, { folder: "products" });
      });
      const results = await Promise.all(uploadPromises);
      newImageUrls = results.map((result) => result.secure_url);
    }

    product.images = [...remainingImages, ...newImageUrls];

    if (name) product.name = name;
    if (quantity) product.quantity = quantity;
    if (originalPrice) product.originalPrice = originalPrice;
    if (description) product.description = description;
    if (category) product.category = category;

    if (discountPercent) {
      product.discountPercent = discountPercent;
      product.discountPrice = Math.round(originalPrice - (originalPrice * discountPercent) / 100);
    } else if (discountPrice) {
      product.discountPrice = discountPrice;
      product.discountPercent = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
    }

    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully", product });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update product", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // ✅ Optionally check if user is logged in
    // const currentUser = await User.findById(req.user._id);
    // if (!currentUser) {
    //   return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    // ✅ Fetch all products
    const products = await Product.find().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const adminId = req.user._id;

    // ✅ Verify logged-in user is admin
    const adminUser = await User.findById(adminId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can fetch all orders",
      });
    }

    // 🔍 Fetch all orders with user details
    const orders = await Order.find()
      .populate("user", "name email mobile") // optional: include user info
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

export const makeMeAdmin = catchAsync(async (req, res) => {
  const userId = req.params.id; // get ID from URL

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.isAdmin = true;
  await user.save();

  res.json({
    success: true,
    message: `${user.name} is now an admin`,
    userId: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

