// Book Routes

const express = require('express');
const router = express.Router();
const { createBook, getBooks, removeBook } = require('../controllers/bookController');

// Add a new book
router.post('/add', createBook);

// Get all books
router.get('/all', getBooks);

// Delete a book
router.delete('/:bookId', removeBook);

module.exports = router;
