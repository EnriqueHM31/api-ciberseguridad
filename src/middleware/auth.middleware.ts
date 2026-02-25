import type { NextFunction, Request, Response } from 'express';
import { loginSchema } from '../schemas/auth.schema';
import { handleAppError } from '../util/errores';

/* ======================================================
VALIDAR LOGIN
====================================================== */

export function validarLoginMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = loginSchema.safeParse(req.body);

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
