/**
 * Middleware global de Express para manejo de errores.
 * Debe registrarse al final del stack.
 * Se encarga de normalizar el error y enviarlo como respuesta HTTP.
 */
import { Request, Response, NextFunction } from 'express';
import { ErrorModel } from '../model/error.model';
import { handleAppError } from '../util/errores';

export async function errorHandlerMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
    const normalized = handleAppError(err);
    const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
    try {
        await ErrorModel.crear({
            codigo_error: normalized.error,
            mensaje_error: normalized.message,
            traza_error: err instanceof Error ? (err.stack ?? null) : null,
            ruta: req.originalUrl,
            metodo_http: req.method,
            id_usuario: (req as any).id_usuario ?? null,
            direccion_ip: ip ?? null,
        });
    } catch (dbError) {
        next(dbError);
        console.error('Error al guardar log en BD:', dbError);
    }

    return res.status(normalized.statusCode).json({
        ok: false,
        error: normalized.error,
        message: normalized.message,
        data: null,
    });
}
