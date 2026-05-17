const User = require('../models/User');
const Otp  = require('../models/Otp');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOtpEmail } = require('../config/email');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const toPublic = (user) => ({
  _id: user._id, name: user.name, email: user.email,
  avatar: user.avatar, isEmailVerified: user.isEmailVerified,
  twoFactorEnabled: user.twoFactorEnabled, settings: user.settings, createdAt: user.createdAt,
});

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(409).json({ message: 'An account with this email already exists.' });

  const user = await User.create({ name, email, password });

  try {
    const otp = await Otp.createOtp(user.email, 'verify-email');
    await sendOtpEmail(user.email, user.name, otp, 'verify');
    return res.status(201).json({ message: 'Account created. Check your email for the OTP.', email: user.email });
  } catch {
    return res.status(201).json({ message: 'Account created. Email service unavailable — contact admin.', email: user.email });
  }
};

// POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

  const result = await Otp.verifyOtp(email.toLowerCase(), otp, 'verify-email');
  if (!result.valid) return res.status(401).json({ message: result.reason });

  const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { isEmailVerified: true, lastLogin: new Date() }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  return res.json({ ...toPublic(user), token: generateToken(user._id) });
};

// POST /api/auth/resend-otp
const resendOtp = async (req, res) => {
  const { email, type } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return res.status(404).json({ message: 'No account found with this email.' });

  const otpType = type === 'reset-password' ? 'reset-password' : 'verify-email';
  const otp = await Otp.createOtp(user.email, otpType);
  try {
    await sendOtpEmail(user.email, user.name, otp, otpType === 'reset-password' ? 'reset' : 'verify');
    return res.json({ message: 'New OTP sent to your email.' });
  } catch {
    return res.status(500).json({ message: 'Failed to send email. Check email configuration.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password.' });

  if (!user.isEmailVerified) {
    const otp = await Otp.createOtp(user.email, 'verify-email');
    try { await sendOtpEmail(user.email, user.name, otp, 'verify'); } catch {}
    return res.status(403).json({ message: 'Email not verified. A new OTP has been sent.', email: user.email, needsVerification: true });
  }

  user.lastLogin = new Date();
  await user.save();
  return res.json({ ...toPublic(user), token: generateToken(user._id) });
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) return res.status(404).json({ message: 'No account found with this email.' });

  const otp = await Otp.createOtp(user.email, 'reset-password');
  try {
    await sendOtpEmail(user.email, user.name, otp, 'reset');
    return res.json({ message: 'OTP sent to your email.', email: user.email });
  } catch {
    return res.status(500).json({ message: 'Failed to send email. Check email configuration in .env' });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields are required.' });
  if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  const result = await Otp.verifyOtp(email.toLowerCase(), otp, 'reset-password');
  if (!result.valid) return res.status(401).json({ message: result.reason });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  user.password = newPassword;
  await user.save();
  return res.json({ message: 'Password reset successfully. You can now log in.' });
};

// GET /api/auth/me
const getMe = async (req, res) => res.json(toPublic(req.user));

module.exports = { register, verifyEmail, resendOtp, login, forgotPassword, resetPassword, getMe };
