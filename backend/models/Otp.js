const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true },
  code:      { type: String, required: true },
  type:      { type: String, enum: ['verify-email', 'reset-password', '2fa'], required: true },
  attempts:  { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.statics.createOtp = async function (email, type) {
  await this.deleteMany({ email, type });
  const raw = Math.floor(100000 + Math.random() * 900000).toString();
  const code = await bcrypt.hash(raw, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await this.create({ email, code, type, expiresAt });
  return raw;
};

otpSchema.statics.verifyOtp = async function (email, raw, type) {
  const record = await this.findOne({ email, type });
  if (!record) return { valid: false, reason: 'OTP expired or not found. Request a new one.' };
  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return { valid: false, reason: 'OTP has expired. Request a new one.' };
  }
  if (record.attempts >= 5) {
    await record.deleteOne();
    return { valid: false, reason: 'Too many attempts. Request a new OTP.' };
  }
  const match = await bcrypt.compare(raw, record.code);
  if (!match) {
    record.attempts += 1;
    await record.save();
    const left = 5 - record.attempts;
    return { valid: false, reason: `Invalid OTP. ${left} attempt${left === 1 ? '' : 's'} remaining.` };
  }
  await record.deleteOne();
  return { valid: true };
};

module.exports = mongoose.model('Otp', otpSchema);
