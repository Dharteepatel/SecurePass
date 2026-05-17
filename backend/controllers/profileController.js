const User = require('../models/User');
const Password = require('../models/Password');

const toPublic = (user) => ({
  _id: user._id, name: user.name, email: user.email,
  avatar: user.avatar, isEmailVerified: user.isEmailVerified,
  twoFactorEnabled: user.twoFactorEnabled, settings: user.settings,
  createdAt: user.createdAt, lastLogin: user.lastLogin,
});

// GET /api/profile
const getProfile = async (req, res) => res.json(toPublic(req.user));

// PUT /api/profile
const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  if (name && name.trim().length < 2)
    return res.status(400).json({ message: 'Name must be at least 2 characters.' });

  if (name) req.user.name = name.trim();
  if (avatar !== undefined) req.user.avatar = avatar;
  await req.user.save();
  return res.json({ message: 'Profile updated.', user: toPublic(req.user) });
};

// PUT /api/profile/password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both fields are required.' });
  if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters.' });

  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword)))
    return res.status(401).json({ message: 'Current password is incorrect.' });

  user.password = newPassword;
  await user.save();
  return res.json({ message: 'Password changed successfully.' });
};

// DELETE /api/profile
const deleteAccount = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required to delete account.' });

  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Incorrect password.' });

  await Password.deleteMany({ userId: req.user._id });
  await user.deleteOne();
  return res.json({ message: 'Account deleted successfully.' });
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
