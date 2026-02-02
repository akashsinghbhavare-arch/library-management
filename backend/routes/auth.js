// Authentication Routes

const express = require('express');
const router = express.Router();
const { signup, signin, getProfile, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Signup route
router.post('/signup', signup);

// Signin route
router.post('/signin', signin);

// Get profile route (protected)
router.get('/profile', authMiddleware, getProfile);

// Logout route (protected)
router.post('/logout', authMiddleware, logout);

module.exports = router;
