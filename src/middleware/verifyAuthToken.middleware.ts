import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../config/index';
import { UUID } from 'node:crypto';

export const verificarAdmin = (req: Request, res: Response, next: NextFunction) => {
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
            });
        }

        next();
    } catch {
        return res.status(401).json({
            ok: false,
            message: 'Token inválido o expirado',
        });
    }
};

export const verificarUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        console.log({ token });

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
    } catch {
        return res.status(401).json({
            ok: false,
            message: 'Token inválido o expirado',
            data: null,
            error: null,
        });
    }
};

export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado',
            });
        }

        jwt.verify(token, JWT_SECRET!);

        next();
    } catch {
        return res.status(401).json({
            ok: false,
            message: 'Token inválido o expirado',
        });
    }
};
