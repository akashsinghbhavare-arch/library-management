# 🎯 SYSTEM ARCHITECTURE & FLOW

## System Overview

```
                        APSZ LIBRARY MANAGEMENT SYSTEM
                        
                    ┌─────────────────────────────────┐
                    │    Frontend (Port 8000)         │
                    │  - signin.html                  │
                    │  - admin-login.html             │
                    │  - homepage.html                │
                    │  - admin.html                   │
                    │  - auth.js                      │
                    └─────────────────────────────────┘
                                  │
                                  ↓
                    ┌─────────────────────────────────┐
                    │    HTTP/REST API                │
                    │    (Port 5000)                  │
                    │                                 │
                    │  /api/auth/signup               │
                    │  /api/auth/signin               │
                    │  /api/auth/admin-login          │
                    │  /api/auth/profile              │
                    │  /api/auth/logout               │
                    └─────────────────────────────────┘
                                  │
                                  ↓
                    ┌─────────────────────────────────┐
                    │    Backend (Node.js)            │
                    │  - server.js                    │
                    │  - authController.js            │
                    │  - authMiddleware               │
                    │  - database.js                  │
                    └─────────────────────────────────┘
                                  │
                                  ↓
                    ┌─────────────────────────────────┐
                    │    SQLite Database              │
                    │  - Users Table                  │
                    │  - Activity Logs Table          │
                    └─────────────────────────────────┘
```

---

## Authentication Flow

### Regular User Sign Up/Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   REGULAR USER FLOW                             │
└─────────────────────────────────────────────────────────────────┘

START: http://localhost:8000/signin.html
   │
   ├─── User chooses "Sign Up"
   │      │
   │      ├─→ Enter: username, email, password
   │      │
   │      └─→ API: POST /api/auth/signup
   │             │
   │             ├─→ Validate input
   │             ├─→ Check if user exists
   │             ├─→ Hash password (bcryptjs)
   │             ├─→ Save to database with role='user'
   │             └─→ Return JWT token
   │
   │      ├─→ localStorage.setItem('token', token)
   │      ├─→ localStorage.setItem('user', {username, email, role='user'})
   │      │
   │      └─→ window.location.href = 'homepage.html'
   │
   ├─── User chooses "Sign In"
   │      │
   │      ├─→ Enter: email, password
   │      │
   │      └─→ API: POST /api/auth/signin
   │             │
   │             ├─→ Find user by email
   │             ├─→ Compare password hash
   │             ├─→ Generate JWT token
   │             └─→ Return user data + token
   │
   │      ├─→ localStorage.setItem('token', token)
   │      ├─→ localStorage.setItem('user', {username, email, role='user'})
   │      │
   │      └─→ window.location.href = 'homepage.html'
   │
   └─── At homepage.html
           │
           ├─→ checkAuth() validates token exists
           ├─→ Display username in navbar
           ├─→ User can access all features
           │
           └─→ Trying to access admin.html?
                  ├─→ checkAdmin() runs
                  ├─→ Checks if role === 'admin'
                  └─→ Redirects back to homepage.html ❌
```

### Admin Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN LOGIN FLOW                            │
└─────────────────────────────────────────────────────────────────┘

START: http://localhost:8000/admin-login.html
   │
   ├─→ Enter: username='apsz', password='apsz04'
   │
   └─→ API: POST /api/auth/admin-login
          │
          ├─→ Find user by username
          │
          ├─→ Is role === 'admin'?
          │   ├─→ NO: Return "Access denied" ❌
          │   │
          │   └─→ YES: Continue ✓
          │
          ├─→ Compare password hash
          │   ├─→ NO MATCH: Return "Invalid password" ❌
          │   │
          │   └─→ MATCH: Continue ✓
          │
          ├─→ Generate JWT token
          │
          └─→ Return user data + token
                 │
                 ├─→ localStorage.setItem('token', token)
                 ├─→ localStorage.setItem('user', {username, role='admin'})
                 │
                 └─→ window.location.href = 'admin.html'

At admin.html:
   │
   ├─→ checkAdmin() runs automatically
   │   ├─→ Checks if token exists ✓
   │   ├─→ Checks if role === 'admin' ✓
   │   │
   │   └─→ PASSES: Display admin panel ✅
   │
   └─→ Admin has full access to all features
```

---

## Access Control Decision Tree

```
┌────────────────────────────────────────────────────────────────┐
│              USER TRIES TO ACCESS admin.html                   │
└────────────────────────────────────────────────────────────────┘

checkAdmin() function runs:
   │
   ├─→ Step 1: Call checkAuth()
   │   │
   │   ├─→ Token exists?
   │   │   ├─→ NO → Redirect to signin.html ❌
   │   │   │
   │   │   └─→ YES → Continue ✓
   │   │
   │   ├─→ User data in localStorage?
   │   │   ├─→ NO → Redirect to signin.html ❌
   │   │   │
   │   │   └─→ YES → Continue ✓
   │   │
   │   └─→ Parse user object
   │
   ├─→ Step 2: Check role
   │   │
   │   ├─→ user.role === 'admin'?
   │   │   ├─→ NO → Redirect to homepage.html ❌
   │   │   │
   │   │   └─→ YES → Continue ✓
   │   │
   │   └─→ Return user object
   │
   └─→ Step 3: Display admin.html ✅
          All admin features available
```

---

## Database Schema

```
┌──────────────────────────────────────┐
│         USERS TABLE                  │
├──────────────────────────────────────┤
│ id (PRIMARY KEY)                     │
│ username (UNIQUE NOT NULL)           │
│ email (UNIQUE NOT NULL)              │
│ password (TEXT NOT NULL - HASHED)    │
│ role (TEXT DEFAULT 'user')           │
│ created_at (TIMESTAMP)               │
│ updated_at (TIMESTAMP)               │
└──────────────────────────────────────┘

Example Data:
┌────┬──────────┬──────────────────────────┐
│ id │ username │ role                     │
├────┼──────────┼──────────────────────────┤
│ 1  │ apsz     │ admin  ← Default Admin   │
│ 2  │ john123  │ user   ← Regular User    │
│ 3  │ jane456  │ user   ← Regular User    │
└────┴──────────┴──────────────────────────┘

┌──────────────────────────────────────┐
│      ACTIVITY LOGS TABLE             │
├──────────────────────────────────────┤
│ id (PRIMARY KEY)                     │
│ user_id (FOREIGN KEY → users.id)     │
│ action (TEXT: 'login', 'logout')     │
│ timestamp (TIMESTAMP)                │
└──────────────────────────────────────┘
```

---

## API Request/Response Examples

### Admin Login Request
```
POST http://localhost:5000/api/auth/admin-login
Content-Type: application/json

{
  "username": "apsz",
  "password": "apsz04"
}
```

### Admin Login Success Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "apsz",
    "email": "admin@apszlibrary.com",
    "role": "admin"
  }
}
```

### User Sign Up Request
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "username": "john123",
  "email": "john@example.com",
  "password": "Test@1234",
  "confirmPassword": "Test@1234",
  "role": "user"
}
```

### User Sign Up Success Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "john123",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Page Protection Logic

```
┌──────────────────────────────────────────────────────────────┐
│                    signin.html                               │
│  (Public - No protection)                                    │
│  ├─ Sign Up Form                                            │
│  ├─ Sign In Form                                            │
│  └─ Admin Login Link                                        │
└──────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┬────────────┐
        ↓                                 ↓            ↓
   ┌─────────────┐           ┌──────────────────┐  ┌───────────┐
   │admin-login  │           │homepage.html     │  │admin.html │
   │.html        │           │(Protected with   │  │(Protected │
   │(Protected   │           │checkAuth())      │  │with       │
   │with admin   │           │├─ User features  │  │checkAdmin)│
   │login)       │           │├─ Logout button  │  │├─ Stats   │
   │├─ Separate  │           │└─ User menu      │  │├─ Add Book│
   │  username   │           └──────────────────┘  │├─ Members │
   │  field      │                   ↓             │└─ Reports │
   │└─ Admin     │         Regular users can't     │           │
   │  password   │         access admin.html       │Non-admin  │
   │  only       │         (redirected to          │users      │
   │             │          homepage.html)         │redirected │
   └─────────────┘                                 │to homepage│
         ↓                                         └───────────┘
    ✅ Admin user                                   ✅ Admin only
   redirected to
   admin.html
```

---

## Token & Session Management

```
┌─────────────────────────────────────────────────────┐
│          CLIENT SIDE (Browser Storage)              │
└─────────────────────────────────────────────────────┘

After successful login:
┌─────────────────────────────────────────────────────┐
│ localStorage                                        │
├─────────────────────────────────────────────────────┤
│ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  │
│        (JWT token with 7-day expiration)           │
│                                                     │
│ user: {                                             │
│   "id": 1,                                          │
│   "username": "apsz",                              │
│   "email": "admin@apszlibrary.com",                │
│   "role": "admin"                                  │
│ }                                                   │
│                                                     │
│ Used for:                                           │
│ ├─ Page protection checks                          │
│ ├─ Authorization headers                           │
│ ├─ User info display                               │
│ └─ Role-based access control                       │
└─────────────────────────────────────────────────────┘

On logout or token expiration:
├─ localStorage.removeItem('token')
├─ localStorage.removeItem('user')
└─ Redirect to signin.html
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────────┐
│               SECURITY IMPLEMENTATION                    │
└──────────────────────────────────────────────────────────┘

Layer 1: PASSWORD HASHING
├─ Algorithm: bcryptjs (10 salt rounds)
├─ Input: Plain password "apsz04"
├─ Output: $2a$10$sC1fH2WfkI3opzGIv9HVVu...
└─ Stored in database (never plain text)

Layer 2: TOKEN GENERATION
├─ Algorithm: JWT (JSON Web Token)
├─ Payload: {id, username, email, role}
├─ Secret: environment variable
├─ Expiration: 7 days
└─ Stored in: localStorage

Layer 3: CORS PROTECTION
├─ Allowed origins: localhost:8000, localhost:3000
├─ Credentials: enabled
└─ Methods: GET, POST, OPTIONS

Layer 4: ROLE-BASED ACCESS CONTROL
├─ User role stored in database
├─ Checked before page access
├─ Automatic redirects if unauthorized
└─ Admin-only endpoints enforced

Layer 5: ACTIVITY LOGGING
├─ All logins logged
├─ All logouts logged
├─ Timestamp recorded
└─ User ID tracked

Layer 6: SESSION PROTECTION
├─ Token required for protected endpoints
├─ Token validated on each request
├─ Token expiration checked
└─ Automatic redirect on expiration
```

---

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER JOURNEY                        │
└─────────────────────────────────────────────────────────────────┘

ADMIN JOURNEY:
Start → admin-login.html
   ↓ (Enter apsz / apsz04)
API Validation
   ↓
admin.html
   ↓ (Full access)
├─ View Dashboard
├─ Add Books
├─ Manage Members
├─ Issue Books
├─ Process Returns
└─ View Reports
   ↓ (Click Logout)
Back to signin.html

REGULAR USER JOURNEY:
Start → signin.html
   ↓ (Sign Up: username, email, password)
API Validation & User Creation
   ↓
homepage.html
   ↓ (Logged in as regular user)
├─ View Profile
├─ Browse Books (future)
├─ View Borrowed Books (future)
└─ Logout
   ↓ (Click Logout)
Back to signin.html

SECURITY CHECK:
Regular user tries → admin.html
   ↓
checkAdmin() function
   ↓
Is admin? NO
   ↓
Redirect to homepage.html
   ↓
User cannot access admin features ✓
```

---

## Summary

✅ **Clear separation** between user and admin flows
✅ **Secure authentication** with hashed passwords
✅ **Token-based sessions** with expiration
✅ **Role-based access control** preventing unauthorized access
✅ **Activity logging** for security audits
✅ **CORS protection** for API security

**System is secure and fully functional!** 🎉

