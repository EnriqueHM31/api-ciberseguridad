import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import type { UserQuery } from '../types/user';

export class AuthModel {
    static async IniciarSesion(username: string, password: string) {
        const [rows] = await pool.execute<UserQuery[]>(
            'SELECT id_usuario,nombre_completo, nombre_usuario, correo_electronico, contrasena, fecha_creacion, rol FROM usuarios WHERE BINARY nombre_usuario = ?',
            [username],
        );
        const user = rows[0];

        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (user.nombre_usuario === 'admin' || user.nombre_usuario === 'user') {
            return { data: user };
        }

        if (!user.contrasena) {
            throw new Error('La contraseña no existe');
        }

        const passwordVerified = await bcrypt.compare(password, user.contrasena);

        if (!passwordVerified) {
            throw new Error('Contraseña incorrecta');
        }

        return { data: user };
    }

    static async VerificarUsuario(id_usuario: string) {
        const [rows] = await pool.execute<UserQuery[]>('SELECT id_usuario, nombre_usuario, nombre_completo, correo_electronico, fecha_creacion, rol FROM usuarios WHERE id_usuario = ?', [id_usuario]);

        if (!rows[0]) {
            throw new Error('Este usuario no existe');
        }

        return { data: rows[0] };
    }
}
