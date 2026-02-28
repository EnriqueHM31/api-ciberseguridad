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
    margin-top: 50px;
    color: #22d3ee;
    border-bottom: 1px solid #1e293b;
    padding-bottom: 5px;
}

.container-endpoint {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.endpoint {
    background: #1e293b;
    padding: 12px;
    border-radius: 6px;
    font-family: monospace;
}

.method {
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 8px;
    font-size: 12px;
}

.get { background: #3b82f6; color: white; }
.post { background: #22c55e; color: black; }
.put { background: #facc15; color: black; }
.delete { background: #ef4444; color: white; }

.descripcion {
    font-size: 12px;
    font-weight: bold;
    background: #334155;
    color: #cbd5e1;
    border-radius: 6px;
    padding: 6px 10px;
    width: fit-content;
}
</style>
</head>

<body>

<h1>API de Seguridad - Documentación</h1>
<p>Backend con autenticación, gestión de usuarios, tareas y recuperación de contraseña.</p>

<!-- AUTH -->
<h2>Auth ( /auth )</h2>

<div class="container-endpoint">
<span class="descripcion">Iniciar sesión en el sistema</span>
<div class="endpoint"><span class="method post">POST</span> /auth/login</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Cerrar sesión</span>
<div class="endpoint"><span class="method post">POST</span> /auth/logout</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Verificar sesión activa</span>
<div class="endpoint"><span class="method post">POST</span> /auth/verify</div>
</div>

<!-- PASSWORD -->
<h2>Password ( /password )</h2>

<div class="container-endpoint">
<span class="descripcion">Administrador resetea contraseña de usuario</span>
<div class="endpoint"><span class="method put">PUT</span> /password/reset/:id_usuario</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Usuario cambia su contraseña autenticado</span>
<div class="endpoint"><span class="method put">PUT</span> /password/change/:id_usuario</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Solicitar código de recuperación</span>
<div class="endpoint"><span class="method post">POST</span> /password/request-reset</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Verificar código de recuperación</span>
<div class="endpoint"><span class="method put">PUT</span> /password/verify-reset</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Resetear contraseña desde login</span>
<div class="endpoint"><span class="method put">PUT</span> /password/reset-password-login</div>
</div>

<!-- TASKS -->
<h2>Tasks ( /task )</h2>

<div class="container-endpoint">
<span class="descripcion">Obtener tareas de un usuario</span>
<div class="endpoint"><span class="method get">GET</span> /task/user/:id_usuario</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Crear nueva tarea</span>
<div class="endpoint"><span class="method post">POST</span> /task</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Modificar o completar tarea</span>
<div class="endpoint"><span class="method put">PUT</span> /task/:id_tarea</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Eliminar tarea</span>
<div class="endpoint"><span class="method delete">DELETE</span> /task/:id_tarea</div>
</div>

<!-- USERS -->
<h2>Users ( /user )</h2>

<div class="container-endpoint">
<span class="descripcion">Obtener todos los usuarios (Admin)</span>
<div class="endpoint"><span class="method get">GET</span> /user</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Crear nuevo usuario (Admin)</span>
<div class="endpoint"><span class="method post">POST</span> /user</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Modificar usuario (Admin)</span>
<div class="endpoint"><span class="method put">PUT</span> /user/:id_usuario</div>
</div>

<div class="container-endpoint">
<span class="descripcion">Eliminar usuario (Admin)</span>
<div class="endpoint"><span class="method delete">DELETE</span> /user/:id_usuario</div>
</div>

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
