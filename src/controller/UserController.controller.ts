import type { Request, Response } from 'express';
import { UserModel } from '../model/user.model';
import type { User } from '../types/user';
import { TratarElError } from '../util/errores';

export class UserController {
    static async ObtenerUsuarios(_req: Request, res: Response) {
        try {
            const { data } = await UserModel.ObtenerTodosUsuarios();

            res.status(200).json({ ok: true, message: 'Listado de usuarios', data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }

    static async CrearUsuario(req: Request, res: Response) {
        try {
            const { nombre_usuario, nombre_completo, correo_electronico, contrasena, rol } = req.body;

            const { data } = await UserModel.crearUsuario({ usuario: { nombre_usuario, nombre_completo, correo_electronico, contrasena, rol } });

            res.status(201).json({ ok: true, message: `Usuario ${data.nombre_usuario} creado correctamente`, data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }

    static async ModificarUsuario(req: Request, res: Response) {
        try {
            const { id_usuario } = req.params as { id_usuario: string };
            const { nombre_usuario, nombre_completo, correo_electronico, rol } = req.body as Omit<User, 'id_usuario'>;

            const { data } = await UserModel.modificarUsuario({ nombre_usuario, nombre_completo, correo_electronico, rol }, id_usuario);

            res.status(200).json({
                ok: true,
                message: `Los datos del usuario ${data.nombre_usuario} han sido actualizados`,
                data: data,
                error: null,
            });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }

    static async EliminarUsuario(req: Request, res: Response) {
        try {
            const { id_usuario } = req.params as { id_usuario: string };
            const { data } = await UserModel.eliminarUsuario({ id_usuario });
            res.status(200).json({ ok: true, message: 'Usuario eliminado correctamente', data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }
}
