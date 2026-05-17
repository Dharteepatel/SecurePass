const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, name, otp, type = 'verify') => {
  const isReset = type === 'reset';
  const subject = isReset ? 'SecurePass - Reset Your Password' : 'SecurePass - Verify Your Email';
  const heading = isReset ? 'Reset Your Password' : 'Verify Your Email Address';
  const message = isReset
    ? 'You requested a password reset. Use the OTP below to set a new password.'
    : 'Welcome to SecurePass! Use the OTP below to verify your email.';

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0a0a0f;color:#f1f5f9;padding:40px;border-radius:16px;border:1px solid #1a1a27">
      <div style="text-align:center;margin-bottom:32px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:#4f46e5;border-radius:14px;margin-bottom:16px">
          <span style="font-size:24px">🔐</span>
        </div>
        <h1 style="margin:0;font-size:24px;font-weight:700;color:#fff">SecurePass</h1>
      </div>
      <h2 style="color:#fff;font-size:20px;margin:0 0 8px">${heading}</h2>
      <p style="color:#94a3b8;margin:0 0 24px">Hi ${name}, ${message}</p>
      <div style="background:#1a1a27;border:1px solid #22223a;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
        <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Your OTP Code</p>
        <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#818cf8">${otp}</div>
        <p style="color:#64748b;font-size:12px;margin:12px 0 0">Expires in <strong style="color:#f59e0b">10 minutes</strong></p>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({ from: `"SecurePass" <${process.env.EMAIL_USER}>`, to, subject, html });
};

module.exports = { sendOtpEmail };
