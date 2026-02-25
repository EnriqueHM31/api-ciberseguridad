import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { AuthController } from '../controller/AuthController.controller';
import { validarLoginMiddleware } from '../middleware/auth.middleware';
import { verificarTokenMiddleware } from '../middleware/verifyAuthToken.middleware';

export const authRouter: ExpressRouter = Router();

// AUTH
authRouter.post('/login', validarLoginMiddleware, AuthController.IniciarSesion);
authRouter.post('/logout', verificarTokenMiddleware, AuthController.CerrarSesion);
authRouter.post('/verify', AuthController.VerificarUsuario);
