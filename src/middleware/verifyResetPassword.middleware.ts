import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_RECOVERY_SECRET } from '../config';

export const verificarResetPassword = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token_password;

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'Token de recuperación requerido',
                data: null,
                error: null,
            });
        }

        const decoded = jwt.verify(token, JWT_RECOVERY_SECRET!);

        req.body.recoverySession = decoded;

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
