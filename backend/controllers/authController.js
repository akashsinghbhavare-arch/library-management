// Authentication Controller

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, getUserByUsername, createUser, getUserById, logActivity } = require('../config/database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Signup Controller
const signup = (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    getUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (user) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Check username uniqueness
      getUserByUsername(username, (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (user) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create user
        createUser(
          {
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
          },
          function(err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Error creating user'
              });
            }

            // Get the created user
            getUserByEmail(email, (err, newUser) => {
              if (err || !newUser) {
                return res.status(500).json({
                  success: false,
                  message: 'Error retrieving user'
                });
              }

              // Generate JWT token
              const token = jwt.sign(
                {
                  id: newUser.id,
                  username: newUser.username,
                  email: newUser.email,
                  role: newUser.role
                },
                JWT_SECRET,
                { expiresIn: '7d' }
              );

              // Log activity
              logActivity(newUser.id, 'User signup', () => {});

              res.status(201).json({
                success: true,
                message: 'Account created successfully',
                token: token,
                user: {
                  id: newUser.id,
                  username: newUser.username,
                  email: newUser.email,
                  role: newUser.role
                }
              });
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
};

// Signin Controller
const signin = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    getUserByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log activity
      logActivity(user.id, 'User signin', () => {});

      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signin'
    });
  }
};

// Get Profile Controller
const getProfile = (req, res) => {
  try {
    const userId = req.userId;

    getUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: user
      });
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Logout Controller
const logout = (req, res) => {
  try {
    const userId = req.userId;

    // Log activity
    logActivity(userId, 'User logout', () => {});

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// Admin Login Controller
const adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find user by username
    getUserByUsername(username, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Check if user is admin
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: Admin credentials required'
        });
      }

      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log activity
      logActivity(user.id, 'Admin login', () => {});

      res.json({
        success: true,
        message: 'Admin login successful',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
};

module.exports = {
  signup,
  signin,
  adminLogin,
  getProfile,
  logout
};
