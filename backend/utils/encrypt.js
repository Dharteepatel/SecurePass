const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const PREFIX = 'ENC:';

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns: ENC:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
function encrypt(text) {
  if (!text) return text;
  if (typeof text === 'string' && text.startsWith(PREFIX)) return text;

  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${PREFIX}${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a value encrypted by encrypt().
 * If the value is legacy plaintext (not prefixed with ENC:),
 * it is returned as-is — fully backward compatible with existing data.
 */
function decrypt(value) {
  if (!value) return value;
  if (typeof value !== 'string' || !value.startsWith(PREFIX)) {
    return value; // Legacy plaintext — return unchanged
  }

  try {
    const parts = value.slice(PREFIX.length).split(':');
    if (parts.length !== 3) return value;

    const [ivHex, authTagHex, ciphertext] = parts;
    const key = getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return value; // Decryption failed — return raw rather than crash
  }
}

module.exports = { encrypt, decrypt };
