import helmet from 'helmet';
import type { RequestHandler } from 'express';

export const securityMiddleware = (): RequestHandler => {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'"],
            },
        },
        frameguard: { action: 'deny' },
    });
};
