import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UUID } from 'node:crypto';
import { JWT_SECRET } from '../config';
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../config/index';
import { handleAppError } from '../util/errores';

export const verificarAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado',
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

        next();
    } catch (error) {
        const normalized = handleAppError(error);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
    }
};

export const verificarUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

        const decoded = jwt.verify(token, JWT_SECRET!) as { id_usuario: UUID; rol: string };

        if (decoded.rol !== USER_ROLE_USER) {
            return res.status(403).json({
                ok: false,
                message: 'Acceso solo para usuarios estándar',
                data: null,
                error: null,
            });
        }

        next();
    } catch (error) {
        const normalized = handleAppError(error);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
    }
};

export const verificarTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado',
                data: null,
                error: 'Token no encontrado',
            });
        }

        jwt.verify(token, JWT_SECRET!);

        next();
    } catch (error) {
        const normalized = handleAppError(error);
        res.status(normalized.statusCode).json({
            data: null,

            ...normalized,
        });
    }
};
