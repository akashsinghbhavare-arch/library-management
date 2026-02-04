// Member Controller - Handle member operations

const { addMember, getAllMembers, deleteMember } = require('../config/database');

// Add a new member
const createMember = (req, res) => {
  const { name, email, phone, password } = req.body;

  // Validation
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: name, email, phone'
    });
  }

  const memberData = {
    name,
    email,
    phone,
    password: password || 'member123'
  };

  addMember(memberData, (err, id) => {
    if (err) {
      console.error('Error adding member:', err);
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to add member'
      });
    }

    res.json({
      success: true,
      message: 'Member added successfully',
      memberId: id
    });
  });
};

// Get all members
const getMembers = (req, res) => {
  getAllMembers((err, members) => {
    if (err) {
      console.error('Error fetching members:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch members'
      });
    }

    res.json({
      success: true,
      members: members || []
    });
  });
};

// Delete a member
const removeMember = (req, res) => {
  const { memberId } = req.params;

  if (!memberId) {
    return res.status(400).json({
      success: false,
      message: 'Member ID is required'
    });
  }

  deleteMember(memberId, (err) => {
    if (err) {
      console.error('Error deleting member:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete member'
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });
  });
};

module.exports = {
  createMember,
  getMembers,
  removeMember
};
