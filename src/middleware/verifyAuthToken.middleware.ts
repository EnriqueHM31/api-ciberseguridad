import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UUID } from 'node:crypto';
import { JWT_SECRET } from '../config';
import { JWT_TOKEN_NAME } from '../config/constants';
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../config/index';

export const verificarAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado',
                data: null,
                error: null,
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET!) as { id_usuario: number; rol: string };

        if (decoded.rol !== USER_ROLE_ADMIN) {
            return res.status(403).json({
                ok: false,
                message: 'Acceso solo para administradores',
                data: null,
                error: null,
            });
        }

        req.user = {
            id_usuario: decoded.id_usuario.toString(),
            rol: decoded.rol,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const verificarUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[JWT_TOKEN_NAME];

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado',
                data: null,
                error: null,
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET!) as { id_usuario: UUID; rol: string };

        if (decoded.rol !== USER_ROLE_USER) {
            return res.status(403).json({
                ok: false,
                message: 'Acceso solo para usuarios estándar',
                data: null,
                error: null,
            });
        }

        req.user = {
            id_usuario: decoded.id_usuario.toString(),
            rol: decoded.rol,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const verificarTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[JWT_TOKEN_NAME];

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado',
                data: null,
                error: 'Token no encontrado',
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET!) as { id_usuario: number; rol: string };

        req.user = {
            id_usuario: decoded.id_usuario.toString(),
            rol: decoded.rol,
        };
        next();
    } catch (error) {
        next(error);
    }
};
