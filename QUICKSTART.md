# Quick Start Guide - APSZ Library Management System

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Backend (Terminal)

```powershell
cd e:\Akash\proj\backend
npm install
npm start
```

Wait for: `Server running on PORT 5000`

### Step 2: Open the Frontend

Open `http://localhost/signin.html` or just open `signin.html` in your browser.

### Step 3: Create an Account

1. Click **"Sign Up"** link
2. Fill the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123456`
   - Confirm: `Test123456`
3. Click **"Create Account"**
4. **You'll be redirected to homepage.html** ✓

### Step 4: Login

1. Click **"Sign In"** link
2. Fill the form:
   - Email: `test@example.com`
   - Password: `Test123456`
3. Click **"Sign In"**
4. **You'll be logged in and see the homepage** ✓

### Step 5: Logout

Click **"Logout"** button in the navbar and you'll be sent back to signin page ✓

---

## 👨‍💼 Create an Admin Account

After creating a regular user, you can promote them to admin:

### Method 1: Using Database (Easiest)

1. Download **DB Browser for SQLite**: https://sqlitebrowser.org/
2. Open `backend/library.db`
3. Go to **Browse Data** tab
4. Select **users** table
5. Find your user and change `role` column from `user` to `admin`
6. Click **Write Changes**
7. Close and restart browser

Now when you login with that email, you'll see `homepage.html` OR `admin.html`

---

## 📁 File Structure Created

```
e:\Akash\proj\
├── backend/                    # NEW - Backend server
│   ├── config/
│   │   └── database.js        # Database setup
│   ├── controllers/
│   │   └── authController.js  # Login/signup logic
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── routes/
│   │   └── auth.js            # API routes
│   ├── server.js              # Express server
│   ├── .env                   # Configuration
│   ├── package.json           # Dependencies
│   └── library.db             # SQLite database (auto-created)
│
├── auth.js                    # UPDATED - Frontend API helper
├── signin.html                # UPDATED - Login/signup forms
├── homepage.html              # UPDATED - User dashboard
├── admin.html                 # UPDATED - Admin panel
└── ...other files
```

---

## 🔐 How It Works

### Registration Flow:
```
User fills signup form 
  → auth.js calls /api/auth/signup
    → Backend creates account
    → Password hashed with bcrypt
    → User stored in SQLite database
    → JWT token generated
  → Token stored in browser localStorage
  → User redirected to homepage.html
```

### Login Flow:
```
User fills signin form
  → auth.js calls /api/auth/signin
    → Backend finds user by email
    → Password verified with bcrypt
    → JWT token generated
  → Token stored in browser localStorage
  → User redirected to homepage.html (or admin.html for admins)
```

### Page Protection:
```
User opens homepage.html
  → checkAuth() runs
    → Checks for token in localStorage
    → If missing → redirect to signin.html
    → If valid → show page
```

---

## 🛠️ What Each File Does

| File | Purpose |
|------|---------|
| `auth.js` | Connects forms to backend API |
| `signin.html` | Login & signup page |
| `homepage.html` | User dashboard (protected) |
| `admin.html` | Admin panel (admin-only) |
| `backend/server.js` | Express web server |
| `backend/config/database.js` | SQLite database management |
| `backend/controllers/authController.js` | Login/signup logic |
| `backend/middleware/auth.js` | JWT token verification |

---

## ⚡ Features

✅ User registration with validation
✅ Secure password hashing (bcrypt)
✅ JWT token-based authentication
✅ Role-based access control (user vs admin)
✅ Protected pages (redirect if not logged in)
✅ Admin-only pages (redirect if not admin)
✅ Logout functionality
✅ SQLite database for data persistence
✅ Beautiful responsive UI

---

## 🐛 Troubleshooting

**Problem:** Backend won't start
```
Solution: npm install in backend folder first
```

**Problem:** Can't connect to backend
```
Solution: Make sure backend is running on port 5000
Check: http://localhost:5000 should show "OK"
```

**Problem:** Forms not submitting
```
Solution: Check browser console (F12) for errors
Make sure auth.js is loaded
Check input field IDs match (signin-email, signin-password, etc)
```

**Problem:** Can't access admin page
```
Solution: Make sure your user role is 'admin' in database
Use DB Browser to check the users table
```

---

## 📞 Need Help?

Check these files:
- **BACKEND_SETUP_GUIDE.md** - Detailed backend setup
- **TESTING_GUIDE.md** - Complete testing procedures
- **auth.js** - Frontend API integration code
- Browser Console (F12) - Error messages

---

## 🎯 Next: Deploy to Production

When ready to deploy:

1. Change `JWT_SECRET` in `backend/.env` to a random string
2. Update `API_URL` in `auth.js` to your server URL
3. Use a real database (not SQLite)
4. Enable HTTPS
5. Configure CORS properly

Happy coding! 🚀
