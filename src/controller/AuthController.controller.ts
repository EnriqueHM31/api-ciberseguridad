import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { JWT_EXPIRES_SESSION, JWT_TOKEN_NAME } from '../config/constants';
import { AuthModel } from '../model/auth.model';

export class AuthController {
    static async IniciarSesion(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;

            const { data } = await AuthModel.IniciarSesion(username, password);

            const token = jwt.sign(
                {
                    id_usuario: data.id_usuario,
                    nombre_usuario: data.nombre_usuario,
                    correo_electronico: data.correo_electronico,
                    rol: data.rol,
                    nombre_completo: data.nombre_completo,
                    fecha_creacion: data.fecha_creacion,
                },
                JWT_SECRET!,
                { expiresIn: JWT_EXPIRES_SESSION },
            );

            res.cookie(JWT_TOKEN_NAME, token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 30 * 60 * 1000,
            });

            res.status(200).json({ ok: true, message: 'Inicio de sesión exitoso', data: data, error: null });
        } catch (error) {
            next(error);
        }
    }

    static async CerrarSesion(_req: Request, res: Response) {
        res.clearCookie(JWT_TOKEN_NAME);
        res.status(200).json({ ok: true, message: 'Sesión cerrada correctamente', data: null, error: null });
    }

    static async VerificarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies?.[JWT_TOKEN_NAME];

            if (!token) {
                res.status(200).json({
                    ok: false,
                    message: 'No autenticado',
                    data: null,
                    error: 'Error en la petición',
                });
                return;
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            const { id_usuario } = decoded as { id_usuario: string };

            const { data } = await AuthModel.VerificarUsuario(id_usuario);

            res.status(200).json({
                ok: true,
                message: 'Usuario autenticado',
                data: data,
                error: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
