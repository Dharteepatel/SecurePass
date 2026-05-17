export function generatePassword(length = 16, opts = {}) {
  const { uppercase=true, lowercase=true, numbers=true, symbols=true } = opts;
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers)   chars += '0123456789';
  if (symbols)   chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const arr = new Uint32Array(length);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(n => chars[n % chars.length]).join('');
}

export function getStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pwd.length >= 8)  s++;
  if (pwd.length >= 12) s++;
  if (pwd.length >= 16) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  if (s <= 2) return { score: s, label: 'Weak',   color: '#ef4444' };
  if (s <= 4) return { score: s, label: 'Fair',   color: '#f59e0b' };
  if (s <= 5) return { score: s, label: 'Good',   color: '#3b82f6' };
  return        { score: s, label: 'Strong', color: '#22c55e' };
}
