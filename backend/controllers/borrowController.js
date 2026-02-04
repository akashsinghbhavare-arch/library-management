// Borrow Controller - Handle book borrowing operations

const { createBorrowRecord, getAllBorrowRecords, getUserBorrowRecords, getTotalMembers, getTotalBooksIssued, getOverdueBooks, getTotalBooks, updateBookStatus, markBorrowReturned, db } = require('../config/database');

// Create a new borrow record
const createBorrow = (req, res) => {
  const { user_id, book_id, book_title, issue_date, return_date } = req.body;

  // Validation
  if (!user_id || !book_title || !issue_date || !return_date) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  const borrowData = {
    user_id,
    book_id: book_id || null,
    book_title,
    issue_date,
    return_date
  };

  createBorrowRecord(borrowData, (err, id) => {
    if (err) {
      console.error('Error creating borrow record:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to create borrow record'
      });
    }
    // If book_id provided, mark book as issued
    if (borrowData.book_id) {
      updateBookStatus(borrowData.book_id, 'issued', (updateErr) => {
        if (updateErr) console.error('Error updating book status:', updateErr);
        // Return response regardless of update result
        res.json({
          success: true,
          message: 'Book borrowed successfully',
          borrowId: id
        });
      });
    } else {
      res.json({
        success: true,
        message: 'Book borrowed successfully',
        borrowId: id
      });
    }
  });
};

// Get all borrow records (admin only)
const getAllBorrows = (req, res) => {
  getAllBorrowRecords((err, records) => {
    if (err) {
      console.error('Error fetching borrow records:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch borrow records'
      });
    }

    res.json({
      success: true,
      records: records || []
    });
  });
};

// Get user's borrow records
const getUserBorrows = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  getUserBorrowRecords(userId, (err, records) => {
    if (err) {
      console.error('Error fetching user borrow records:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch borrow records'
      });
    }

    res.json({
      success: true,
      records: records || []
    });
  });
};

// Get dashboard stats
const getDashboardStats = (req, res) => {
  Promise.all([
    new Promise((resolve) => {
      getTotalMembers((err, result) => {
        resolve(err ? 0 : result?.count || 0);
      });
    }),
    new Promise((resolve) => {
      getTotalBooksIssued((err, result) => {
        resolve(err ? 0 : result?.count || 0);
      });
    }),
    new Promise((resolve) => {
      getOverdueBooks((err, result) => {
        resolve(err ? 0 : result?.count || 0);
      });
    }),
    new Promise((resolve) => {
      getTotalBooks((err, result) => {
        resolve(err ? 0 : result?.count || 0);
      });
    })
  ])
    .then(([totalMembers, booksIssued, overdueBooks, totalBooks]) => {
      res.json({
        success: true,
        stats: {
          totalMembers,
          booksIssued,
          overdueBooks,
          totalBooks
        }
      });
    })
    .catch((error) => {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stats'
      });
    });
};

// Process return of a borrowed book
const processReturn = (req, res) => {
  const { borrowId, actualReturnDate } = req.body;

  if (!borrowId) {
    return res.status(400).json({ success: false, message: 'borrowId is required' });
  }

  const returnDate = actualReturnDate || new Date().toISOString().split('T')[0];

  // Mark borrow record as returned
  markBorrowReturned(borrowId, returnDate, (err) => {
    if (err) {
      console.error('Error marking borrow returned:', err);
      return res.status(500).json({ success: false, message: 'Failed to mark borrow as returned' });
    }

    // Fetch the borrow record to get the book_id
    db.get('SELECT book_id FROM borrow_records WHERE id = ?', [borrowId], (getErr, row) => {
      if (getErr) {
        console.error('Error fetching borrow record:', getErr);
        return res.json({ success: true, message: 'Marked returned (book status not updated)'});
      }

      if (row && row.book_id) {
        updateBookStatus(row.book_id, 'available', (updErr) => {
          if (updErr) console.error('Error updating book status to available:', updErr);
          return res.json({ success: true, message: 'Book return processed successfully' });
        });
      } else {
        return res.json({ success: true, message: 'Book return processed successfully' });
      }
    });
  });
};

module.exports = {
  createBorrow,
  getAllBorrows,
  getUserBorrows,
  getDashboardStats,
  processReturn
};
