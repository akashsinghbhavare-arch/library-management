# APSZ Library Management System

A complete library management system with user authentication, role-based access control, and a modern responsive interface.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Any web browser

### Setup & Run

**Terminal 1 - Backend Server:**
```powershell
cd e:\Akash\proj\backend
npm install
npm start
```

**Terminal 2 - Frontend Server:**
```powershell
cd e:\Akash\proj
node frontend-server.js
```

**Open in Browser:**
```
http://localhost:8000/signin.html
```

---

## 📁 Project Structure

```
e:\Akash\proj\
│
├── Frontend Files
│   ├── signin.html              Login/Signup page
│   ├── homepage.html            User dashboard
│   ├── admin.html               Admin panel
│   ├── index.html               Home page
│   ├── auth.js                  API integration
│   ├── signin.css               Signin styling
│   ├── homepage.css             Homepage styling
│   ├── admin.css                Admin styling
│   ├── style.css                Global styling
│   ├── frontend-server.js       Frontend HTTP server
│   └── imgs/                    Images folder
│
├── Backend Folder
│   └── backend/
│       ├── server.js            Express server
│       ├── package.json         Dependencies
│       ├── .env                 Configuration
│       ├── database.db          SQLite database
│       ├── config/
│       │   └── database.js      Database setup
│       ├── controllers/
│       │   └── authController.js Auth logic
│       ├── middleware/
│       │   └── auth.js          JWT verification
│       └── routes/
│           └── auth.js          API endpoints
│
└── Documentation
    └── QUICKSTART.md            Quick start guide
```

---

## 🔐 Features

✅ User Registration & Login
✅ Password Hashing (Bcryptjs)
✅ JWT Authentication
✅ Role-Based Access Control (User/Admin)
✅ Protected Pages
✅ User Dashboard
✅ Admin Panel
✅ SQLite Database
✅ Beautiful Responsive UI

---

## 📝 Create Account

1. Click "Sign Up"
2. Enter:
   - Username
   - Email
   - Password
   - Confirm Password
3. Click "Create Account"
4. Automatically logged in and redirected to dashboard

---

## 🔑 Login

1. Click "Sign In"
2. Enter:
   - Email
   - Password
3. Click "Sign In"
4. Redirected to appropriate page (user/admin)

---

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| POST | `/api/auth/logout` | Logout user (protected) |

---

## 💾 Database

SQLite database stores:
- User accounts (username, email, hashed password, role)
- Activity logs (user actions)

Database location: `backend/database.db`

---

## 🔑 Admin Account

To create an admin account:

1. Download **DB Browser for SQLite**: https://sqlitebrowser.org/
2. Open `backend/database.db`
3. Edit user and change `role` to `admin`
4. Save and refresh browser

---

## 🛑 Stop Services

Press **Ctrl+C** in each terminal to stop:
- Backend server
- Frontend server

---

## 📖 More Documentation

See `QUICKSTART.md` for detailed setup steps.

---

## 🎉 Ready to Go!

Your authentication system is complete and production-ready.

Happy coding! 🚀
