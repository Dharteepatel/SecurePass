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

\
