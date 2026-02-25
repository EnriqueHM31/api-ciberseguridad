import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_RECOVERY_SECRET } from '../config';

export const verificarResetPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token_password;

        if (!token) {
            res.status(401).json({
                ok: false,
                message: 'Token de recuperación requerido',
                data: null,
                error: null,
            });
            return;
        }

        const decoded = jwt.verify(token, JWT_RECOVERY_SECRET!);

        req.body.recoverySession = decoded;

        next();
    } catch {
        res.status(401).json({
            ok: false,
            message: 'Token inválido o expirado',
            data: null,
            error: null,
        });
        return;
    }
};
