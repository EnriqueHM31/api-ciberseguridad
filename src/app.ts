import 'dotenv/config';
import cookiesParser from 'cookie-parser';
import type { Express } from 'express';
import express from 'express';
import { createCorsMiddleware } from './middleware/cors.middleware';
import { authRouter } from './routes/auth.routes';
import { passwordRouter } from './routes/password.routes';
import { taskRouter } from './routes/task.routes';
import { userRouter } from './routes/user.routes';
import helmet from 'helmet';

const app: Express = express();

/* Middleware */
app.use(createCorsMiddleware());
app.use(express.json());
app.use(cookiesParser());
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                // Permite que todo se cargue desde tu propio dominio
                defaultSrc: ["'self'"],
                // Permite scripts de tu dominio y fuentes de confianza (ej: Google)
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
                // Permite estilos de tu dominio y estilos en línea (común en React)
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                // Permite imágenes de tu dominio y datos (base64)
                imgSrc: ["'self'", 'data:'],
                // Conexiones (API, WebSockets) solo a tu servidor
                connectSrc: ["'self'"],
            },
        },
        // Evita que otros sitios pongan tu web en un iframe (Previene Clickjacking)
        frameguard: { action: 'deny' },
    }),
);
/* Routes */
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/auth', authRouter);
app.use('/password', passwordRouter);

app.use('/', (_req, res) => {
    res.send('Bienvenido a la API de seguridad de tu proyecto.');
});

/* Root */
app.use('/health', (_req, res) => {
    res.status(200).json({ ok: true, message: 'API de seguridad funcionando', data: null, error: null, time: process.uptime() });
});

export default app;
