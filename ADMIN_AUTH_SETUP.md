
# Admin Authentication Setup Guide

## What Was Added

I've created a complete admin authentication system with the following components:

### 1. **New Admin Login Page** (`admin-login.html`)
- Dedicated admin login page with secure UI
- Restricted access warning
- Admin-only credentials requirement

### 2. **Database Updates**
- Admin role support already in place
- Default admin user will be created via seed script
- Admin users can only be created by database manipulation (security feature)

### 3. **Backend API Updates**
- New `/api/auth/admin-login` endpoint
- Admin verification before granting access
- Proper error handling for non-admin users

### 4. **Frontend Updates**
- Updated signin.html with link to admin login
- Updated auth.js with admin login handler
- Admin.html already has checkAdmin() function for protection

---

## Setup Instructions

### Step 1: Seed Database with Default Admin User

Run this command in the backend folder:

```powershell
cd e:\Akash\proj\backend
npm run seed
```

**Output will show:**
```
✓ Admin user created successfully!

Admin Credentials:
  Username: admin
  Password: admin123

⚠️  Please change the password after first login!
```

### Step 2: Start Backend Server

```powershell
cd e:\Akash\proj\backend
npm start
```

### Step 3: Start Frontend Server

In a new terminal:

```powershell
cd e:\Akash\proj
node frontend-server.js
```

### Step 4: Access the Application

#### For Regular Users:
```
http://localhost:8000/signin.html
```
- Sign up or sign in with email
- Access to homepage.html

#### For Admin Users:
```
http://localhost:8000/admin-login.html
```
- Use username: `admin`
- Use password: `admin123`
- Access to admin.html

---

## User Flow

### Regular User Flow:
1. User navigates to signin.html
2. Signs up with email/password OR signs in
3. Gets redirect to homepage.html
4. Cannot access admin.html (will be redirected)

### Admin Flow:
1. Click "Admin Login" link on signin.html
2. Navigate to admin-login.html
3. Enter admin username & password
4. Gets token and redirected to admin.html
5. Can use all admin features

---

## Database Schema

### Users Table:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',  -- 'admin' or 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## Security Features Implemented

✅ **Password Hashing**: Using bcryptjs
✅ **JWT Tokens**: 7-day expiration
✅ **Admin-Only Routes**: Separate /admin-login endpoint
✅ **Role-Based Access**: checkAdmin() function protects pages
✅ **Activity Logging**: All logins/logouts are logged
✅ **CORS Protection**: Backend accepts only allowed origins

---

## Important Notes

⚠️ **Change Default Password**: After first admin login, immediately change the password from 'admin123'

⚠️ **Creating New Admins**: Currently, new admin users should only be created through database directly (security best practice)

⚠️ **Token Storage**: Tokens are stored in localStorage for persistent sessions

---

## Admin Features Available

On the admin.html page, admins can:
- View dashboard statistics (books, members, issued items)
- Add new books to library
- Add new members
- Issue books to members
- Process book returns
- View and manage recent additions

---

## Files Modified/Created

### New Files:
- `admin-login.html` - Dedicated admin login page
- `backend/seed.js` - Database seeding script

### Modified Files:
- `signin.html` - Added admin login link
- `auth.js` - Added handleAdminLogin() function
- `backend/controllers/authController.js` - Added adminLogin controller
- `backend/routes/auth.js` - Added admin-login route
- `backend/package.json` - Added seed script

---

## Troubleshooting

### Admin login not working?
1. Check if seed.js has been run: `npm run seed`
2. Verify backend is running on port 5000
3. Check browser console for API errors

### Access denied to admin.html?
1. Must login through admin-login.html, not regular signin
2. Verify user role is 'admin' in database
3. Clear localStorage and try again

### Database issues?
Delete `backend/database.db` and restart server to recreate fresh database, then run seed again.

