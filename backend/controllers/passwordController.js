const Password = require('../models/Password');
const { encrypt, decrypt } = require('../utils/encrypt');

// Helper: decrypt password field before sending to client
function decryptEntry(entry) {
  const obj = entry.toObject ? entry.toObject() : { ...entry };
  obj.password = decrypt(obj.password);
  return obj;
}

const getPasswords = async (req, res) => {
  const { search, category } = req.query;
  const filter = { userId: req.user._id };
  if (category && category !== 'All') filter.category = category;
  if (search) filter.$or = [
    { siteName: { $regex: search, $options: 'i' } },
    { username: { $regex: search, $options: 'i' } },
  ];
  const passwords = await Password.find(filter).sort({ createdAt: -1 });
  return res.json(passwords.map(decryptEntry));
};

const createPassword = async (req, res) => {
  const { siteName, siteUrl, username, password, category, notes } = req.body;
  if (!siteName || !username || !password)
    return res.status(400).json({ message: 'Site name, username, and password are required.' });

  const entry = await Password.create({
    userId:   req.user._id,
    siteName,
    siteUrl,
    username,
    password: encrypt(password),   // 🔐 AES-256-GCM encrypted
    category: category || 'Other',
    notes:    notes || '',
  });

  return res.status(201).json(decryptEntry(entry));
};

const updatePassword = async (req, res) => {
  const entry = await Password.findOne({ _id: req.params.id, userId: req.user._id });
  if (!entry) return res.status(404).json({ message: 'Entry not found.' });

  const fields = ['siteName', 'siteUrl', 'username', 'category', 'notes', 'isFavorite'];
  fields.forEach(f => { if (req.body[f] !== undefined) entry[f] = req.body[f]; });

  // Encrypt the password if it's being updated
  if (req.body.password !== undefined) {
    entry.password = encrypt(req.body.password);
  }

  const saved = await entry.save();
  return res.json(decryptEntry(saved));
};

const deletePassword = async (req, res) => {
  const entry = await Password.findOne({ _id: req.params.id, userId: req.user._id });
  if (!entry) return res.status(404).json({ message: 'Entry not found.' });
  await entry.deleteOne();
  return res.json({ message: 'Deleted.' });
};

const toggleFavorite = async (req, res) => {
  const entry = await Password.findOne({ _id: req.params.id, userId: req.user._id });
  if (!entry) return res.status(404).json({ message: 'Entry not found.' });
  entry.isFavorite = !entry.isFavorite;
  const saved = await entry.save();
  return res.json(decryptEntry(saved));
};

const getStats = async (req, res) => {
  const userId = req.user._id;
  const [total, favorites, recentlyAdded] = await Promise.all([
    Password.countDocuments({ userId }),
    Password.countDocuments({ userId, isFavorite: true }),
    Password.countDocuments({ userId, createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } }),
  ]);
  return res.json({ total, favorites, recentlyAdded });
};

module.exports = { getPasswords, createPassword, updatePassword, deletePassword, toggleFavorite, getStats };
