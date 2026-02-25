import type { NextFunction, Request, Response } from 'express';
import { usuarioCrearSchema, usuarioIdSchema, usuarioModificarSchema } from '../schemas/user.schema';
import { handleAppError } from '../util/errores';

/* ======================================================
VALIDAR CREAR USUARIO
====================================================== */

export const validarCrearUsuarioMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        usuarioCrearSchema.parse(req.body);

        next();
    } catch (error: unknown) {
        const normalized = handleAppError(error);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }
};

/* ======================================================
VALIDAR ID USUARIO (params)
====================================================== */

export const validarIdUsuarioMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const resultado = usuarioIdSchema.safeParse(req.params);

    if (!resultado.success) {
        const normalized = handleAppError(resultado.error);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }

    req.params = resultado.data;

    next();
};

/* ======================================================
VALIDAR MODIFICAR USUARIO
====================================================== */

export const validarModificarUsuarioMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const resultado = usuarioModificarSchema.safeParse(req.body);

    if (!resultado.success) {
        const normalized = handleAppError(resultado.error);
        res.status(normalized.statusCode).json({
            data: null,
            ...normalized,
        });
        return;
    }
    req.body = resultado.data;
    next();
};
