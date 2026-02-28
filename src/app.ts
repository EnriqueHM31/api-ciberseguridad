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

app.get('/', (_req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <title>API Seguridad - Documentación</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #0f172a;
                color: #f1f5f9;
                margin: 0;
                padding: 40px;
            }
            h1 {
                color: #38bdf8;
            }
            h2 {
                margin-top: 40px;
                color: #22d3ee;
            }
            .endpoint {
                background: #1e293b;
                padding: 10px;
                margin: 5px 0;
                border-radius: 6px;
                font-family: monospace;
            }
            .method {
                font-weight: bold;
                color: #4ade80;
            }
        </style>
    </head>
    <body>

        <h1>API de Seguridad - Documentación</h1>
        <p>Backend con autenticación, gestión de usuarios, tareas y recuperación de contraseña.</p>

        <h2>Auth ( /auth )</h2>
        <div class="endpoint"><span class="method">POST</span> /auth/login</div>
        <div class="endpoint"><span class="method">POST</span> /auth/logout</div>
        <div class="endpoint"><span class="method">POST</span> /auth/verify</div>

        <h2>Password ( /password )</h2>
        <div class="endpoint"><span class="method">PUT</span> /password/reset/:id_usuario</div>
        <div class="endpoint"><span class="method">PUT</span> /password/change/:id_usuario</div>
        <div class="endpoint"><span class="method">POST</span> /password/request-reset</div>
        <div class="endpoint"><span class="method">PUT</span> /password/verify-reset</div>
        <div class="endpoint"><span class="method">PUT</span> /password/reset-password-login</div>

        <h2>Tasks ( /task )</h2>
        <div class="endpoint"><span class="method">GET</span> /task/user/:id_usuario</div>
        <div class="endpoint"><span class="method">POST</span> /task</div>
        <div class="endpoint"><span class="method">PUT</span> /task/:id_tarea</div>
        <div class="endpoint"><span class="method">DELETE</span> /task/:id_tarea</div>

        <h2>Users ( /user )</h2>
        <div class="endpoint"><span class="method">GET</span> /user</div>
        <div class="endpoint"><span class="method">POST</span> /user</div>
        <div class="endpoint"><span class="method">PUT</span> /user/:id_usuario</div>
        <div class="endpoint"><span class="method">DELETE</span> /user/:id_usuario</div>

        <hr style="margin-top:40px; opacity:0.2;">

        <p>Servidor activo y funcionando correctamente.</p>

    </body>
    </html>
    `);
});

app.use('/health', (_req, res) => {
    res.status(200).json({ ok: true, message: 'API de seguridad funcionando', data: null, error: null, time: process.uptime() });
});

// Middleware global para manejo de errores
app.use(errorHandlerMiddleware);

export default app;
