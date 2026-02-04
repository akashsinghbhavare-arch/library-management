// Authentication Routes

const express = require('express');
const router = express.Router();
const { signup, signin, adminLogin, getProfile, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Signup route
router.post('/signup', signup);

// Signin route
router.post('/signin', signin);

// Admin login route (no auth required)
router.post('/admin-login', adminLogin);

// Get profile route (protected)
router.get('/profile', authMiddleware, getProfile);

// Logout route (protected)
router.post('/logout', authMiddleware, logout);

module.exports = router;
