// Book Controller - Handle book operations

const { addBook, getAllBooks, deleteBook } = require('../config/database');

// Add a new book
const createBook = (req, res) => {
  const { title, author, category, isbn } = req.body;

  // Validation
  if (!title || !author || !category) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: title, author, category'
    });
  }

  const bookData = {
    title,
    author,
    category,
    isbn: isbn || null
  };

  addBook(bookData, (err, id) => {
    if (err) {
      console.error('Error adding book:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add book'
      });
    }

    res.json({
      success: true,
      message: 'Book added successfully',
      bookId: id
    });
  });
};

// Get all books
const getBooks = (req, res) => {
  getAllBooks((err, books) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch books'
      });
    }

    res.json({
      success: true,
      books: books || []
    });
  });
};

// Delete a book
const removeBook = (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: 'Book ID is required'
    });
  }

  deleteBook(bookId, (err) => {
    if (err) {
      console.error('Error deleting book:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete book'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  });
};

module.exports = {
  createBook,
  getBooks,
  removeBook
};
