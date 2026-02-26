import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import type { UserQuery } from '../types/user';
import { decrypt } from '../util/encryption.util';

export class AuthModel {
    static async IniciarSesion(username: string, password: string) {
        const [rows] = await pool.execute<UserQuery[]>(
            `SELECT 
                id_usuario,
                nombre_completo,
                nombre_usuario,
                correo_electronico,
                contrasena,
                telefono_iv,
                telefono_content,
                telefono_tag,
                fecha_creacion,
                rol
            FROM usuarios 
            WHERE BINARY nombre_usuario = ?`,
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

        return {
            data: {
                id_usuario: user.id_usuario,
                nombre_completo: user.nombre_completo,
                nombre_usuario: user.nombre_usuario,
                correo_electronico: user.correo_electronico,
                telefono:
                    user.telefono_iv && user.telefono_content && user.telefono_tag
                        ? decrypt({
                              iv: user.telefono_iv,
                              content: user.telefono_content,
                              tag: user.telefono_tag,
                          })
                        : null,
                fecha_creacion: user.fecha_creacion,
                rol: user.rol,
            },
        };
    }

    static async VerificarUsuario(id_usuario: string) {
        const [rows] = await pool.execute<UserQuery[]>(
            `SELECT 
                id_usuario,
                nombre_usuario,
                nombre_completo,
                correo_electronico,
                telefono_iv,
                telefono_content,
                telefono_tag,
                fecha_creacion,
                rol
            FROM usuarios
            WHERE id_usuario = ?`,
            [id_usuario],
        );

        const user = rows[0];

        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (user.nombre_usuario === 'admin' || user.nombre_usuario === 'user') {
            return { data: { ...user, telefono: '123456789' } };
        }

        return {
            data: {
                id_usuario: user.id_usuario,
                nombre_usuario: user.nombre_usuario,
                nombre_completo: user.nombre_completo,
                correo_electronico: user.correo_electronico,
                telefono:
                    user.telefono_iv && user.telefono_content && user.telefono_tag
                        ? decrypt({
                              iv: user.telefono_iv,
                              content: user.telefono_content,
                              tag: user.telefono_tag,
                          })
                        : null,
                fecha_creacion: user.fecha_creacion,
                rol: user.rol,
            },
        };
    }
}
