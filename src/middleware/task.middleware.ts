import type { NextFunction, Request, Response } from 'express';
import { tareaCrearSchema, tareaIdSchema, usuarioIdSchema } from '../schemas/task.schema';
import { handleAppError } from '../util/errores';

/* ======================================================
VALIDAR CREAR TAREA
====================================================== */

export function validarCrearTareaMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = tareaCrearSchema.safeParse(req.body);

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

/* ======================================================
VALIDAR ID TAREA (params)
====================================================== */

export function validarIdTareaMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = tareaIdSchema.safeParse(req.params);

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
VALIDAR ID USUARIO (params)
====================================================== */

export function validarIdUsuarioTareaMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = usuarioIdSchema.safeParse(req.params);

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
