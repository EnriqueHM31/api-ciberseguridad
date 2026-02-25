import type { NextFunction, Request, Response } from 'express';
import { validarUsuarioCrear, validarUsuarioId, validarUsuarioModificar } from '../schemas/user.schema';
import { formatearErroresZod } from '../util/errores';

/* ======================================================
VALIDAR CREAR USUARIO
====================================================== */

export const validarCrearUsuarioMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = validarUsuarioCrear(req.body);

        req.body = data;

        next();
    } catch (error: unknown) {
        res.status(400).json({
            ok: false,
            message: formatearErroresZod(error),
            data: null,
            error: 'Datos inválidos para crear usuario',
        });
        return;
    }
};

/* ======================================================
VALIDAR ID USUARIO (params)
====================================================== */

export const validarIdUsuarioMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const resultado = validarUsuarioId(req.params);

        if (!resultado.success) {
            return res.status(400).json({
                ok: false,
                message: formatearErroresZod(resultado.error),
                data: null,
                error: 'ID inválido',
            });
        }

        req.params = resultado.data;

        next();
    } catch (error: unknown) {
        res.status(500).json({
            ok: false,
            data: null,
            message: formatearErroresZod(error),
            error: 'Error interno del servidor',
        });
        return;
    }
};

/* ======================================================
VALIDAR MODIFICAR USUARIO
====================================================== */

export const validarModificarUsuarioMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const resultado = validarUsuarioModificar(req.body);

        if (!resultado.success) {
            res.status(400).json({
                ok: false,
                data: null,
                message: formatearErroresZod(resultado.error),
                error: 'Datos inválidos para actualizar usuario',
            });
            return;
        }

        req.body = resultado.data;

        next();
    } catch (error) {
        res.status(500).json({
            ok: false,
            data: null,
            message: error,
            error: 'Error interno del servidor',
        });
        return;
    }
};
