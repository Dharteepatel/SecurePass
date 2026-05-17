const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  siteName:   { type: String, required: true, trim: true },
  siteUrl:    { type: String, trim: true, default: '' },
  username:   { type: String, required: true, trim: true },
  password:   { type: String, required: true },
  category:   { type: String, enum: ['Social','Work','Finance','Shopping','Entertainment','Other'], default: 'Other' },
  isFavorite: { type: Boolean, default: false },
  notes:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);
