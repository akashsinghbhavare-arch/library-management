// Borrow Routes

const express = require('express');
const router = express.Router();
const { createBorrow, getAllBorrows, getUserBorrows, getDashboardStats, processReturn } = require('../controllers/borrowController');

// Create a new borrow record
router.post('/create', createBorrow);

// Get all borrow records (admin only)
router.get('/all', getAllBorrows);

// Get user's borrow records
router.get('/user/:userId', getUserBorrows);

// Get dashboard stats for admin
router.get('/stats/dashboard', getDashboardStats);

// Process return of a borrowed book
router.post('/return', processReturn);

module.exports = router;
