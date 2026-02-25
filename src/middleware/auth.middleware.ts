import type { NextFunction, Request, Response } from 'express';
import { validarLogin } from '../schemas/auth.schema';
import { handleAppError } from '../util/errores';

/* ======================================================
VALIDAR LOGIN
====================================================== */

export function validarLoginMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = validarLogin(req.body);

    if (!result.success) {
        const normalized = handleAppError(result);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    req.body = result.data;

    next();
}
