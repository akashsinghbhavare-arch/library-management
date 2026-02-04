# 🚀 Quick Start - Admin Login

## 30-Second Setup

### Already Running ✅
- Backend: http://localhost:5000
- Frontend: http://localhost:8000

### Login URLs

**👤 Regular User Login:**
```
http://localhost:8000/signin.html
```

**🔐 Admin Login:**
```
http://localhost:8000/admin-login.html
Username: admin
Password: admin123
```

---

## What Works Now

### ✅ User Registration & Login
- Sign up with email on signin.html
- Login with email/password
- Access homepage.html

### ✅ Admin Authentication
- Separate admin login page (admin-login.html)
- Admin-only access to admin.html
- Default admin account ready to use

### ✅ Database Features
- User roles (admin/user)
- Hashed passwords
- JWT tokens
- Activity logging

### ✅ Access Control
- Regular users: Can't access admin panel
- Admin users: Full access to all features
- Automatic redirection based on role

---

## Database

**SQLite Database** at: `backend/database.db`

Users table with:
- username (unique)
- email (unique)
- password (hashed)
- role (admin or user)

---

## Test It Now

1. **Test Regular User:**
   - Go to http://localhost:8000/signin.html
   - Sign up with new account
   - Should go to homepage.html

2. **Test Admin:**
   - Go to http://localhost:8000/admin-login.html
   - Login: admin / admin123
   - Should go to admin.html

3. **Test Access Control:**
   - Try accessing admin.html as regular user
   - Should redirect to homepage.html

---

## If Something Breaks

```powershell
# Reset database
cd e:\Akash\proj\backend
rm database.db
npm start

# In new terminal
npm run seed
```

---

## Files Changed

✨ **New:**
- admin-login.html
- backend/seed.js

📝 **Updated:**
- signin.html (added admin link)
- auth.js (added admin handler)
- backend/authController.js (added admin endpoint)
- backend/routes/auth.js (added admin route)

---

**All done!** Your admin authentication system is live. 🎉

