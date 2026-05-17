const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true, minlength: 8 },
  avatar:           { type: String, default: '' },
  isEmailVerified:  { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  lastLogin:        { type: Date },
  createdAt:        { type: Date, default: Date.now },
  settings: {
    theme:         { type: String, enum: ['dark', 'light'], default: 'dark' },
    language:      { type: String, default: 'en' },
    timezone:      { type: String, default: 'Asia/Kolkata' },
    notifications: {
      emailAlerts:    { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
      weeklyReport:   { type: Boolean, default: false },
    },
    privacy: {
      showEmail:    { type: Boolean, default: false },
      publicProfile:{ type: Boolean, default: false },
    },
  },
}, { timestamps: false });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
