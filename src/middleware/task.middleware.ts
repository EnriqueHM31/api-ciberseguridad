import type { Request, Response, NextFunction } from 'express';
import { validarTareaCrear, validarTareaId, validarUsuarioIdTarea } from '../schemas/task.schema';
import { handleAppError } from '../util/errores';

/* ======================================================
VALIDAR CREAR TAREA
====================================================== */

export function validarCrearTareaMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = validarTareaCrear(req.body);

    if (!result.success) {
        res.status(400).json({
            ok: false,
            error: 'Error de validación',
            data: null,
            message: handleAppError(result.error).message,
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
    const result = validarTareaId(req.params);

    if (!result.success) {
        res.status(400).json({
            ok: false,
            error: 'Error de validación',
            data: null,
            message: handleAppError(result.error).message,
        });
        return;
    }

    next();
}

/* ======================================================
VALIDAR ID USUARIO (params)
====================================================== */

export function validarIdUsuarioTareaMiddleware(req: Request, res: Response, next: NextFunction) {
    const result = validarUsuarioIdTarea(req.params);

    if (!result.success) {
        res.status(400).json({
            ok: false,
            error: 'Error de validación',
            data: null,
            message: handleAppError(result.error).message,
        });
        return;
    }

    next();
}
