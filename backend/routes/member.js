// Member Routes

const express = require('express');
const router = express.Router();
const { createMember, getMembers, removeMember } = require('../controllers/memberController');

// Add a new member
router.post('/add', createMember);

// Get all members
router.get('/all', getMembers);

// Delete a member
router.delete('/:memberId', removeMember);

module.exports = router;
