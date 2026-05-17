const User = require('../models/User');

// GET /api/settings
const getSettings = async (req, res) => res.json(req.user.settings);

// PUT /api/settings
const updateSettings = async (req, res) => {
  const { theme, language, timezone, notifications, privacy } = req.body;

  if (theme) req.user.settings.theme = theme;
  if (language) req.user.settings.language = language;
  if (timezone) req.user.settings.timezone = timezone;
  if (notifications) {
    req.user.settings.notifications = { ...req.user.settings.notifications, ...notifications };
  }
  if (privacy) {
    req.user.settings.privacy = { ...req.user.settings.privacy, ...privacy };
  }

  req.user.markModified('settings');
  await req.user.save();
  return res.json({ message: 'Settings saved.', settings: req.user.settings });
};

// PUT /api/settings/2fa
const toggle2FA = async (req, res) => {
  req.user.twoFactorEnabled = !req.user.twoFactorEnabled;
  await req.user.save();
  return res.json({ message: `2FA ${req.user.twoFactorEnabled ? 'enabled' : 'disabled'}.`, enabled: req.user.twoFactorEnabled });
};

module.exports = { getSettings, updateSettings, toggle2FA };
