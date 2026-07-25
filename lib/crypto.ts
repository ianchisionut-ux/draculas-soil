import crypto from "crypto";

/**
 * Encrypts/decrypts sensitive setting values (Stripe secret key, webhook
 * secret, etc.) before they touch the database, so a DB leak alone does not
 * expose live credentials.
 *
 * Requires APP_ENCRYPTION_KEY in the environment: a 32-byte key, base64
 * encoded. Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const key = process.env.APP_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "APP_ENCRYPTION_KEY is not set. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\" and add it to your .env"
    );
  }
  const buf = Buffer.from(key, "base64");
  if (buf.length !== 32) {
    throw new Error("APP_ENCRYPTION_KEY must decode to exactly 32 bytes.");
  }
  return buf;
}

export function encrypt(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // store as iv:authTag:cipherText, all base64
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(":");
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(":");
  if (!ivB64 || !tagB64 || !dataB64) throw new Error("Malformed encrypted payload.");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}
