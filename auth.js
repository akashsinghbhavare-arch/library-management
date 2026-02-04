// API Configuration
const API_URL = 'http://localhost:5000/api';

// Helper function to make API calls
async function makeRequest(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Network error' };
  }
}

// Signup Handler
async function handleSignup() {
  // Try multiple possible field selectors
  const username = document.getElementById('signup-username')?.value ||
                   document.getElementById('sname')?.value;
  const email = document.getElementById('signup-email')?.value ||
                document.getElementById('email')?.value;
  const password = document.getElementById('signup-password')?.value ||
                   document.getElementById('spassword')?.value;
  const confirmPassword = document.getElementById('signup-confirm')?.value ||
                          document.getElementById('spassword2')?.value;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    alert('Please fill all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  const data = {
    username: username,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    role: 'user'
  };

  const result = await makeRequest('/auth/signup', 'POST', data);

  if (result.success) {
    // Store token and user data
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    alert('Account created successfully!');
    
    // Redirect based on role
    setTimeout(() => {
      if (result.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 500);
  } else {
    alert('Error: ' + result.message);
  }
}

// Signin Handler
async function handleSignin() {
  // Try multiple possible field selectors
  const email = document.getElementById('signin-email')?.value ||
                document.getElementById('name')?.value;
  const password = document.getElementById('signin-password')?.value ||
                   document.getElementById('password')?.value;

  // Validation
  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }

  const result = await makeRequest('/auth/signin', 'POST', {
    email: email,
    password: password
  });

  if (result.success) {
    // Store token and user data
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    alert('Login successful!');
    
    // Redirect based on role
    setTimeout(() => {
      if (result.user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 500);
  } else {
    alert('Error: ' + result.message);
  }
}

// Logout Handler
async function handleLogout() {
  const result = await makeRequest('/auth/logout', 'POST');

  if (result.success) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logout successful');
    window.location.href = 'signin.html';
  } else {
    alert('Error during logout');
  }
}

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = 'signin.html';
    return null;
  }

  return JSON.parse(user);
}

// Check if user is admin
function checkAdmin() {
  const user = checkAuth();

  if (!user || user.role !== 'admin') {
    window.location.href = 'index.html';
    return null;
  }

  return user;
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Display user info in navbar
function displayUserInfo() {
  const user = getCurrentUser();

  if (user) {
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');

    if (userNameElement) {
      userNameElement.textContent = user.username;
    }
    if (userRoleElement) {
      userRoleElement.textContent = `(${user.role.toUpperCase()})`;
    }
  }
}

// Admin Login Handler
async function handleAdminLogin() {
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;

  if (!username || !password) {
    alert('Please fill all fields');
    return;
  }

  const result = await makeRequest('/auth/admin-login', 'POST', {
    username: username,
    password: password
  });

  if (result.success) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    alert('Admin login successful!');
    window.location.href = 'admin.html';
  } else {
    alert('Error: ' + result.message);
  }
}

// Setup form submission handlers on page load
document.addEventListener('DOMContentLoaded', function() {
  // Display user info if on protected page
  const token = localStorage.getItem('token');
  if (token) {
    displayUserInfo();
  }
});

