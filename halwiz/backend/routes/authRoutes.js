import express from 'express';
const router = express.Router();
// import protect  from '../middleware/protect.js';
import * as authController from '../controllers/authController.js';
import protect  from '../middleware/protect.js';
import upload from "../middleware/multer.js";


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMyProfile);
router.put('/make-admin/:id', protect, authController.makeMeAdmin);
router.post('/sendWhatsApp', authController.sendWhatsAppOtp);
router.post('/verifyWhatsapp', protect,authController.verifyWhatsAppOtp);
router.post('/add-address', protect,authController.addAddress);
router.delete('/del-address', protect,authController.deleteAddress);
router.get('/all-users', protect,authController.getAllUsersByAdmin);
router.post("/add-product", protect, upload.array("images", 5), authController.createProduct);
router.post("/delete-product", protect, authController.deleteProduct);
router.put("/update-product", protect, upload.array("images", 5), authController.updateProduct);
router.get("/get-product", protect, authController.getAllProducts);
router.post("/create-order", protect, authController.createOrder);
router.post('/clear-cart', protect , authController.clearCart);
router.post("/cancel-order", protect, authController.cancelOrder);
router.post("/return-order", protect, authController.returnOrder);
router.get("/get-orders", protect, authController.getMyOrders);
router.get("/get-all-orders", protect, authController.getAllOrders);
router.post("/add-rating", protect, authController.addRating);
// ✅ Cart Routes
router.post('/cart', protect, authController.addOrUpdateCartItem);
router.delete('/cart/:productId', protect, authController.removeCartItem);
router.post('/wishlist', protect, authController.toggleWishlist);
router.get('/cart-wishlist', protect, authController.getCartAndWishlist);
router.get('/cart', protect, authController.getCartItems);
router.delete('/cart/all/:productId', protect, authController.removeItemCompletely);
// ✅ User adds a testimonial
router.post('/add-testimonial', protect, authController.addTestimonial);

// ✅ User updates their testimonial
router.put('/update-testimonial/:testimonialId', protect, authController.updateTestimonial);

// ✅ Admin gets all testimonials
router.get('/all-testimonials', protect, authController.getAllTestimonials);

export default router;