import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_RECOVERY_SECRET } from '../config';
import { JWT_TOKEN_PASSWORD_NAME } from '../config/constants';

export const verificarTokenResetPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.[JWT_TOKEN_PASSWORD_NAME];

        if (!token) {
            res.status(401).json({
                ok: false,
                message: 'Token de recuperación requerido',
                data: null,
                error: null,
            });
            return;
        }

        const decoded = jwt.verify(token, JWT_RECOVERY_SECRET!) as { id_usuario: string };

        req.user = {
            id_usuario: decoded.id_usuario,
        };

        next();
    } catch (error) {
        next(error);
    }
};
