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
   Helper genérico
====================================================== */

function validateSchema(schema: any, data: any, res: Response) {
    const result = schema.safeParse(data);

    if (!result.success) {
        res.status(400).json({
            ok: false,
            error: 'Error de validación',
            data: null,
            message: handleAppError(result.error),
        });
        return;
    }

    return result.data;
}

/* ======================================================
Resetear por ID
====================================================== */

export function validarResetearPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    const validated = validateSchema(resetearPasswordSchema, { ...req.params, ...req.body }, res);

    if (!validated) return;

    next();
}

/* ======================================================
 Cambiar contraseña autenticado
====================================================== */

export function validarCambiarPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    const validated = validateSchema(cambiarPasswordSchema, { ...req.params, ...req.body }, res);

    if (!validated) return;

    next();
}

/* ======================================================
Solicitar OTP
====================================================== */

export function validarRequestResetMiddleware(req: Request, res: Response, next: NextFunction) {
    const validated = validateSchema(requestResetSchema, req.body, res);

    if (!validated) return;

    next();
}

/* ======================================================
Verificar OTP
====================================================== */

export function validarVerifyResetMiddleware(req: Request, res: Response, next: NextFunction) {
    const validated = validateSchema(verifyResetSchema, req.body, res);

    if (!validated) return;

    next();
}

/* ======================================================
Reset final con OTP
====================================================== */

export function validarResetPasswordFinalMiddleware(req: Request, res: Response, next: NextFunction) {
    const validated = validateSchema(resetPasswordFinalSchema, req.body, res);

    if (!validated) return;

    next();
}
