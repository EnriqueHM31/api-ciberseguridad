import rateLimit from 'express-rate-limit';

export const resetLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3, // Limitar a 3 solicitudes por ventana
    message: {
        status: 429,
        message: 'Has alcanzado el límite de solicitudes, inténtalo de nuevo en 30 minutos',
        data: null,
        error: 'Demasiadas solicitudes de recuperación',
    },
});

export const resetLimitPassword = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3, // Limitar a 3 solicitudes por ventana
    message: {
        status: 429,
        message: 'Has alcanzado el límite de solicitudes, inténtalo de nuevo en 30 minutos',
        data: null,
        error: 'Demasiadas solicitudes de recuperación',
    },
});
