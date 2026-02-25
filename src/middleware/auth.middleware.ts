import type { NextFunction, Request, Response } from 'express';
import { validarLogin } from '../schemas/auth.schema';
import { formatearErroresZod } from '../util/errores';

/* ======================================================
VALIDAR LOGIN
====================================================== */

export function validarLoginMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = validarLogin(req.body);

    if (!result.success) {
        res.status(400).json({
            ok: false,
            error: 'Error de validación',
            data: null,
            message: formatearErroresZod(result.error),
        });
        return;
    }

    // Sanitiza el body con datos ya validados
    req.body = result.data;

    next();
}
