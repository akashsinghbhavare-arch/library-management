# 🚀 QUICK REFERENCE - APSZ Library

## ✅ System Status: READY

Servers: ✅ Running | Database: ✅ Ready | Admin: ✅ Configured

---

## 📍 Access Points

### Regular User
```
URL: http://localhost:8000/signin.html
Sign Up or Sign In with Email
↓
Redirects to: http://localhost:8000/homepage.html
```

### Admin User
```
URL: http://localhost:8000/admin-login.html
Username: apsz
Password: apsz04
↓
Redirects to: http://localhost:8000/admin.html
```

---

## 🔐 Login Credentials

| User Type | Username | Password | First Visit |
|-----------|----------|----------|:----------:|
| Admin | apsz | apsz04 | admin.html |
| Regular | Email | Password | Create account first |

---

## ✨ What Works

✅ User registration with email
✅ User login with email & password
✅ Admin login with username & password
✅ Automatic role-based redirects
✅ Homepage for regular users
✅ Admin dashboard for admins
✅ Access control (non-admin can't see admin.html)
✅ Logout functionality
✅ Password hashing
✅ JWT tokens

---

## 📊 User Permissions

### Regular User Can:
- ✅ Sign up
- ✅ Sign in
- ✅ Access homepage.html
- ✅ View profile
- ✅ Logout
- ❌ Access admin.html
- ❌ Manage books
- ❌ Manage members

### Admin User Can:
- ✅ Login with username
- ✅ Access admin.html
- ✅ View dashboard
- ✅ Add books
- ✅ Add members
- ✅ Issue books
- ✅ Process returns
- ✅ View reports
- ✅ Logout

---

## 🛠️ Start/Stop Servers

### Start Backend:
```powershell
cd e:\Akash\proj\backend
npm start
```

### Start Frontend:
```powershell
cd e:\Akash\proj
node frontend-server.js
```

### Reset Database:
```powershell
cd e:\Akash\proj\backend
npm run seed
```

---

## 🗄️ Database Location

File: `e:\Akash\proj\backend\database.db`

Contains:
- Users table (with roles)
- Activity logs

---

## 🧪 Quick Test

1. Go to http://localhost:8000/signin.html
2. Sign up with email
3. Get redirected to homepage.html ✓
4. Go to http://localhost:8000/admin-login.html
5. Login with apsz / apsz04
6. Get redirected to admin.html ✓

---

## ⚡ Important

- Admin username: **apsz** (lowercase)
- Admin password: **apsz04** (no spaces)
- Regular users need EMAIL, not username
- Tokens expire after 7 days
- Passwords are bcrypt hashed

---

## 🆘 Issues?

| Problem | Solution |
|---------|----------|
| Can't login | Check credentials in console |
| Redirect not working | Clear localStorage, try again |
| Server error | Kill node.exe, restart servers |
| Database locked | Kill all node.exe processes |

---

**System Status: ✅ OPERATIONAL**

All features working. Ready for testing!

