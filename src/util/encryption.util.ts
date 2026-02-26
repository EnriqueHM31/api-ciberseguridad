import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

const ENCRYPTION_KEY = Buffer.from(process.env.DATA_ENCRYPTION_KEY!, 'hex');
const HASH_KEY = Buffer.from(process.env.PHONE_HASH_KEY!, 'hex');

if (ENCRYPTION_KEY.length !== 32) {
    throw new Error('DATA_ENCRYPTION_KEY debe tener 32 bytes');
}

if (HASH_KEY.length !== 32) {
    throw new Error('PHONE_HASH_KEY debe tener 32 bytes');
}

/* =========================
   Normalización
========================= */

export function normalizePhone(phone: string): string {
    // elimina todo excepto números
    const digits = phone.replace(/\D/g, '');

    // ejemplo básico para México (+52)
    if (digits.length === 10) {
        return '52' + digits;
    }

    return digits;
}

/* =========================
   HMAC para unicidad
========================= */

export function hashPhone(phone: string): string {
    return crypto.createHmac('sha256', HASH_KEY).update(phone).digest('hex');
}

/* =========================
   Cifrado
========================= */

export function encrypt(text: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    const authTag = cipher.getAuthTag();

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex'),
        tag: authTag.toString('hex'),
    };
}

/* =========================
   Descifrado
========================= */

export function decrypt(payload: { iv: string; content: string; tag: string }) {
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(payload.iv, 'hex'));

    decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(payload.content, 'hex')), decipher.final()]);

    return decrypted.toString('utf8');
}
