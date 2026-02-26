import type { NextFunction, Request, Response } from 'express';
import {
    cambiarPasswordSchema,
    requestResetSchema,
    resetearPasswordSchema,
    resetPasswordFinalSchema,
    verifyResetSchema,
} from '../schemas/password.schema';
import { handleAppError } from '../util/errores';

/* ======================================================
Resetear por ID
====================================================== */

export function validarResetearPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = resetearPasswordSchema.safeParse({ ...req.params, ...req.body });

    if (!result.success) {
        const normalized = handleAppError(result);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    next();
}

/* ======================================================
 Cambiar contraseña autenticado
====================================================== */

export function validarCambiarPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = cambiarPasswordSchema.safeParse({ ...req.params, ...req.body });

    if (!result.success) {
        const normalized = handleAppError(result);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    next();
}

/* ======================================================
Solicitar OTP
====================================================== */

export function validarRequestResetMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = requestResetSchema.safeParse(req.body);
    if (!result.success) {
        const normalized = handleAppError(result);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    next();
}

/* ======================================================
Verificar OTP
====================================================== */

export function validarVerifyResetMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = verifyResetSchema.safeParse(req.body);

    if (!result.success) {
        const normalized = handleAppError(result);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    next();
}

/* ======================================================
Reset final con OTP
====================================================== */

export function validarResetPasswordFinalMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = resetPasswordFinalSchema.safeParse(req.body);
    if (!result.success) {
        const normalized = handleAppError(result);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    next();
}
