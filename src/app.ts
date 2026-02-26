import cookiesParser from 'cookie-parser';
import 'dotenv/config';
import type { Express } from 'express';
import express from 'express';
import { createCorsMiddleware } from './middleware/cors.middleware';
import { errorHandlerMiddleware } from './middleware/error.middleware';
import { securityMiddleware } from './middleware/security.middleware';
import { authRouter } from './routes/auth.routes';
import { passwordRouter } from './routes/password.routes';
import { taskRouter } from './routes/task.routes';
import { userRouter } from './routes/user.routes';

const app: Express = express();

/* Middleware */
app.use(createCorsMiddleware());
app.use(securityMiddleware());
app.use(express.json());
app.use(cookiesParser());
/* Routes */
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/auth', authRouter);
app.use('/password', passwordRouter);

app.use('/', (_req, res) => {
    res.send('Bienvenido a la API de seguridad de tu proyecto.');
});

app.use('/health', (_req, res) => {
    res.status(200).json({ ok: true, message: 'API de seguridad funcionando', data: null, error: null, time: process.uptime() });
});

// Middleware global para manejo de errores
app.use(errorHandlerMiddleware);

export default app;
