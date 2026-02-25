import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config/index';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,

    ssl: {
        ca: fs.readFileSync(path.resolve('ca.pem')),
        rejectUnauthorized: false,
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
});

/**
 * Función para verificar conexión inicial y ESTADO DEL CIFRADO
 */
export async function testDatabaseConnection() {
    let connection;
    try {
        connection = await pool.getConnection();

        // --- TEST DE SEGURIDAD ADICIONAL ---
        // Consultamos la variable de sesión para verificar el cifrado real
        const [rows]: any = await connection.query("SHOW STATUS LIKE 'Ssl_cipher'");
        const cipher = rows[0]?.Value;

        if (cipher) {
            console.log(`✅ Conexión a MySQL establecida con éxito.`);
            console.log(`🔒 Seguridad: Conexión cifrada mediante SSL (Cipher: ${cipher})`);
        } else {
            console.warn('⚠️ Conexión establecida pero NO parece estar cifrada (SSL inactivo).');
        }
    } catch (error: any) {
        console.error('❌ Error crítico al conectar con MySQL:', error.message);

        // Error común: Si el servidor no soporta SSL o los certificados están mal
        if (error.code === 'HANDSHAKE_SSL_ERROR') {
            console.error('👉 Tip: Revisa que tu servidor MySQL tenga SSL habilitado y los certificados coincidan.');
        }

        process.exit(1);
    } finally {
        if (connection) connection.release();
    }
}
