import bcrypt from 'bcrypt';
import type { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database';
import type { User, UserQuery } from '../types/user';

export class UserModel {
    static async ObtenerTodosUsuarios() {
        const [rows] = await pool.execute<UserQuery[]>('SELECT id_usuario, nombre_usuario, nombre_completo, correo_electronico, fecha_creacion, rol FROM usuarios');

        if (!rows) {
            throw new Error('No se encontraron usuarios');
        }

        return { data: rows };
    }

    static async crearUsuario({ usuario }: { usuario: Omit<User, 'id_usuario'> }) {
        // Validación manual opcional (puedes eliminarla si confías en UNIQUE)
        const [existeCorreo] = await pool.execute<UserQuery[]>('SELECT id_usuario FROM usuarios WHERE BINARY correo_electronico = ?', [usuario.correo_electronico]);

        if (existeCorreo.length > 0) {
            throw new Error('Ese correo ya está vinculado a otro usuario');
        }

        const [existeUsername] = await pool.execute<UserQuery[]>('SELECT id_usuario FROM usuarios WHERE BINARY nombre_usuario = ?', [usuario.nombre_usuario]);

        if (existeUsername.length > 0) {
            throw new Error('Ese nombre de usuario ya está vinculado a otro usuario');
        }

        const id_usuario = crypto.randomUUID();
        const passwordHash = await bcrypt.hash(usuario.contrasena, 10);

        await pool.execute(`INSERT INTO usuarios (id_usuario, nombre_usuario, nombre_completo, correo_electronico, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)`, [
            id_usuario,
            usuario.nombre_usuario,
            usuario.nombre_completo,
            usuario.correo_electronico,
            passwordHash,
            usuario.rol,
        ]);

        const [usuarioCreado] = await pool.execute<UserQuery[]>(
            `SELECT id_usuario, nombre_usuario, nombre_completo, correo_electronico, fecha_creacion, rol FROM usuarios WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        if (!usuarioCreado[0]) {
            throw new Error('No se pudo crear el usuario');
        }

        return { data: usuarioCreado[0] };
    }

    static async modificarUsuario(usuario: Omit<User, 'id_usuario' | 'fecha_creacion' | 'contrasena' | 'fecha_actualizacion'>, id_usuario: string) {
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE usuarios SET nombre_usuario = ?, 
                nombre_completo = ?, 
                correo_electronico = ?, 
                rol = ?, 
                fecha_actualizacion = CURRENT_TIMESTAMP WHERE BINARY id_usuario = ?`,
            [usuario.nombre_usuario, usuario.nombre_completo, usuario.correo_electronico, usuario.rol, id_usuario],
        );

        if (result.affectedRows === 0) {
            throw new Error('El usuario no existe');
        }

        const [usuarioActualizado] = await pool.execute<UserQuery[]>(
            `SELECT id_usuario, nombre_usuario, nombre_completo, 
                    correo_electronico, fecha_creacion, fecha_actualizacion, rol FROM usuarios WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        if (!usuarioActualizado[0]) {
            throw new Error('El usuario no existe');
        }

        return { data: usuarioActualizado[0] };
    }

    static async eliminarUsuario({ id_usuario }: { id_usuario: string }) {
        const [result] = await pool.execute<ResultSetHeader>('DELETE FROM usuarios WHERE BINARY id_usuario = ?', [id_usuario]);

        if (result.affectedRows === 0) {
            throw new Error('El usuario no existe');
        }

        return { data: id_usuario };
    }
}
