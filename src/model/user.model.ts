import bcrypt from 'bcrypt';
import type { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database';
import type { User, UserQuery } from '../types/user';
import { decrypt, encrypt, hashPhone } from '../util/encryption.util';

export class UserModel {
    static async ObtenerTodosUsuarios() {
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
             FROM usuarios`,
        );

        if (!rows || rows.length === 0) {
            throw new Error('No se encontraron usuarios');
        }

        const data = rows.map((user) => ({
            id_usuario: user.id_usuario,
            nombre_usuario: user.nombre_usuario,
            nombre_completo: user.nombre_completo,
            fecha_creacion: user.fecha_creacion,
            telefono: decrypt({
                iv: user.telefono_iv,
                content: user.telefono_content,
                tag: user.telefono_tag,
            }),
            correo_electronico: user.correo_electronico,
            rol: user.rol,
        }));

        return { data };
    }

    static async crearUsuario({ usuario }: { usuario: Omit<User, 'id_usuario'> }) {
        // 1️⃣ Validar correo
        const [existeCorreo] = await pool.execute<UserQuery[]>('SELECT id_usuario FROM usuarios WHERE BINARY correo_electronico = ?', [
            usuario.correo_electronico,
        ]);

        if (existeCorreo.length > 0) {
            throw new Error('Ese correo ya está vinculado a otro usuario');
        }

        // 2️⃣ Validar username
        const [existeUsername] = await pool.execute<UserQuery[]>('SELECT id_usuario FROM usuarios WHERE BINARY nombre_usuario = ?', [
            usuario.nombre_usuario,
        ]);

        if (existeUsername.length > 0) {
            throw new Error('Ese nombre de usuario ya está vinculado a otro usuario');
        }

        // 3️⃣ Normalizar teléfono
        const telefonoNormalizado = usuario.telefono;

        // 4️⃣ Generar hash para unicidad
        const telefonoHash = hashPhone(telefonoNormalizado);

        const [existeTelefono] = await pool.execute<UserQuery[]>('SELECT id_usuario FROM usuarios WHERE telefono_hash = ?', [telefonoHash]);

        if (existeTelefono.length > 0) {
            throw new Error('Ese teléfono ya está registrado');
        }

        // 5️⃣ Cifrar teléfono
        const { iv, content, tag } = encrypt(telefonoNormalizado);

        const id_usuario = crypto.randomUUID();
        const passwordHash = await bcrypt.hash(usuario.contrasena, 10);

        // 6️⃣ Insertar
        await pool.execute(
            `INSERT INTO usuarios (
                id_usuario,
                nombre_usuario,
                nombre_completo,
                correo_electronico,
                contrasena,
                rol,
                telefono_iv,
                telefono_content,
                telefono_tag,
                telefono_hash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_usuario,
                usuario.nombre_usuario,
                usuario.nombre_completo,
                usuario.correo_electronico,
                passwordHash,
                usuario.rol,
                iv,
                content,
                tag,
                telefonoHash,
            ],
        );

        const [usuarioCreado] = await pool.execute<UserQuery[]>(
            `SELECT id_usuario, nombre_usuario, nombre_completo, correo_electronico, telefono_iv, telefono_content, telefono_tag, fecha_creacion, rol
             FROM usuarios
             WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        if (!usuarioCreado[0]) {
            throw new Error('No se pudo crear el usuario');
        }
        const data = usuarioCreado.map((user) => ({
            id_usuario: user.id_usuario,
            nombre_usuario: user.nombre_usuario,
            nombre_completo: user.nombre_completo,
            fecha_creacion: user.fecha_creacion,
            telefono: decrypt({
                iv: user.telefono_iv,
                content: user.telefono_content,
                tag: user.telefono_tag,
            }),
            correo_electronico: user.correo_electronico,
            rol: user.rol,
        }));

        return { data: data[0] };
    }

    static async modificarUsuario(usuario: Omit<User, 'id_usuario' | 'fecha_creacion' | 'contrasena' | 'fecha_actualizacion'>, id_usuario: string) {
        const telefonoHash = hashPhone(usuario.telefono);

        const [existeTelefono] = await pool.execute<UserQuery[]>('SELECT id_usuario FROM usuarios WHERE telefono_hash = ? AND id_usuario != ?', [
            telefonoHash,
            id_usuario,
        ]);

        if (existeTelefono.length > 0) {
            throw new Error('Ese teléfono ya pertenece a otro usuario');
        }

        const { iv, content, tag } = encrypt(usuario.telefono);

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE usuarios SET 
                nombre_usuario = ?, 
                nombre_completo = ?, 
                correo_electronico = ?, 
                rol = ?, 
                telefono_iv = ?,
                telefono_content = ?,
                telefono_tag = ?,
                telefono_hash = ?,
                fecha_actualizacion = CURRENT_TIMESTAMP
             WHERE BINARY id_usuario = ?`,
            [usuario.nombre_usuario, usuario.nombre_completo, usuario.correo_electronico, usuario.rol, iv, content, tag, telefonoHash, id_usuario],
        );

        if (result.affectedRows === 0) {
            throw new Error('El usuario no existe');
        }
        console.log({ result });
        const [usuarioActualizado] = await pool.execute<UserQuery[]>(
            `SELECT id_usuario, nombre_usuario, nombre_completo, 
                    correo_electronico, telefono_iv, telefono_content, telefono_tag, telefono_hash, fecha_creacion, fecha_actualizacion, rol 
             FROM usuarios 
             WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        if (!usuarioActualizado[0] || usuarioActualizado.length === 0) {
            throw new Error('El usuario no existe');
        }

        console.log({ usuarioActualizado });

        const data = usuarioActualizado.map((user) => ({
            id_usuario: user.id_usuario,
            nombre_usuario: user.nombre_usuario,
            nombre_completo: user.nombre_completo,
            fecha_creacion: user.fecha_creacion,
            telefono: decrypt({
                iv: user.telefono_iv,
                content: user.telefono_content,
                tag: user.telefono_tag,
            }),
            correo_electronico: user.correo_electronico,
            rol: user.rol,
        }));

        console.log({ data });

        return { data: data[0] };
    }

    static async eliminarUsuario({ id_usuario }: { id_usuario: string }) {
        const [result] = await pool.execute<ResultSetHeader>('DELETE FROM usuarios WHERE BINARY id_usuario = ?', [id_usuario]);

        if (result.affectedRows === 0) {
            throw new Error('El usuario no existe');
        }

        return { data: id_usuario };
    }
}
