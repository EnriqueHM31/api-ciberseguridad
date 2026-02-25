import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { AuthController } from '../controller/AuthController.controller';
import { validarLoginMiddleware } from '../middleware/auth.middleware';
import { verificarTokenMiddleware } from '../middleware/verifyAuthToken.middleware';

export const authRouter: ExpressRouter = Router();

// RUTA PARA QUE EL USUARIO PUEDA LOGIN
authRouter.post('/login', validarLoginMiddleware, AuthController.IniciarSesion);

// RUTA PARA QUE EL USUARIO PUEDA CERRAR SESIÓN
authRouter.post('/logout', verificarTokenMiddleware, AuthController.CerrarSesion);

// RUTA PARA QUE EL USUARIO PUEDA VERIFICAR QUE EL USUARIO ESTA AUTENTICADO Y EXISTE (CECKEO DE SESIÓN)
authRouter.post('/verify', AuthController.VerificarUsuario);
