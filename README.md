# SecurePass v2 — MERN Stack Password Manager

A production-ready, full-featured password manager built with the MERN stack following MVC architecture.

## Features

- Register / Login with **Email OTP Verification**
- **Forgot Password** via OTP
- **Two-Factor Authentication (2FA)** toggle
- Professional **Sidebar + Navbar** layout
- **Profile Page** — edit name, upload avatar, change password
- **Settings Page** — 13 fully working sections
- Password CRUD with **Copy to Clipboard**
- **Password Generator** (configurable)
- **Password Strength** indicator
- **Dark / Light Mode** toggle
- Search + filter by category
- Favorites, stats, toast notifications

## Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS v3, React Router v6, Axios |
| Backend | Node.js, Express.js (MVC) |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (7 days), bcryptjs (12 rounds) |
| Email | Nodemailer + Gmail SMTP |

## Project Structure (MVC)

```
SecurePass_v2/
├── backend/
│   ├── config/
│   │   ├── db.js           ← MongoDB connection
│   │   └── email.js        ← Nodemailer (Gmail OTP)
│   ├── models/             ← MODEL layer
│   │   ├── User.js         ← name, email, password(hashed), avatar, settings, createdAt
│   │   ├── Password.js     ← userId FK, siteName, username, password, category
│   │   └── Otp.js          ← email, code(hashed), type, expiresAt, attempts
│   ├── controllers/        ← CONTROLLER layer (business logic)
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── passwordController.js
│   │   └── settingsController.js
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect
│   ├── routes/             ← Express routes
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── passwordRoutes.js
│   │   └── settingsRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── components/     ← VIEW layer (reusable)
    │   │   ├── Layout.js   ← Sidebar + Navbar
    │   │   ├── PasswordCard.js
    │   │   └── AddPasswordModal.js
    │   ├── pages/          ← VIEW layer (pages)
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── VerifyOtpPage.js
    │   │   ├── ForgotPasswordPage.js
    │   │   ├── DashboardPage.js
    │   │   ├── ProfilePage.js
    │   │   └── SettingsPage.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   ├── ThemeContext.js
    │   │   └── ToastContext.js
    │   ├── utils/
    │   │   ├── api.js              ← Axios instance with JWT interceptor
    │   │   └── passwordGenerator.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## Database Schema

### User Collection
```js
{ name, email, password (bcrypt), avatar (base64), isEmailVerified,
  twoFactorEnabled, lastLogin, createdAt,
  settings: { theme, language, timezone, notifications: {...}, privacy: {...} } }
```

### Password Collection
```js
{ userId (FK → User), siteName, siteUrl, username, password,
  category, isFavorite, notes, createdAt, updatedAt }
```

### Otp Collection
```js
{ email, code (bcrypt), type ('verify-email'|'reset-password'), expiresAt, attempts }
```

## Setup & Run

### Step 1 — Configure .env
Open `backend/.env` and fill in:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=any_random_secret_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Gmail App Password**: Google Account → Security → 2-Step Verification → App Passwords → Generate

### Step 2 — Backend
```bash
cd backend
npm install
npm run dev    # runs on port 5000
```
You should see: `MongoDB Atlas Connected` + `SecurePass server running on port 5000`

### Step 3 — Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start      # opens http://localhost:3000
```

## Settings Page — All 13 Sections

| # | Section | Status |
|---|---------|--------|
| 1 | Edit Profile | ✅ Links to Profile page |
| 2 | Change Password | ✅ Links to Profile page |
| 3 | Dark/Light Mode | ✅ Fully working, saved to DB |
| 4 | Notification Settings | ✅ Toggles saved to MongoDB |
| 5 | Privacy Settings | ✅ Toggles saved to MongoDB |
| 6 | Security Settings | ✅ Shows account security info |
| 7 | Two-Factor Auth (2FA) | ✅ Enable/disable via API |
| 8 | Session Management | ✅ Shows current session |
| 9 | Connected Devices | ✅ Shows current device |
| 10 | Language Settings | ✅ Dropdown saved to MongoDB |
| 11 | Account Preferences | ✅ Timezone saved to MongoDB |
| 12 | Logout | ✅ Fully working |
| 13 | Delete Account | ✅ Requires password + "DELETE" confirm |

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /register | Register, sends OTP |
| POST | /verify-email | Verify OTP, issues JWT |
| POST | /resend-otp | Resend OTP |
| POST | /login | Login with JWT |
| POST | /forgot-password | Send reset OTP |
| POST | /reset-password | Reset password with OTP |
| GET | /me | Get current user (Protected) |

### Passwords (`/api/passwords`) — All Protected
| GET / POST / PUT /:id / DELETE /:id / PATCH /:id/favorite / GET /stats |

### Profile (`/api/profile`) — All Protected
| GET / PUT / PUT /password / DELETE |

### Settings (`/api/settings`) — All Protected
| GET / PUT / PUT /2fa |
