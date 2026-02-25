import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { AuthController } from '../controller/AuthController.controller';
import { validarLoginMiddleware } from '../middleware/auth.middleware';
import { verificarToken } from '../middleware/verifyAuthToken.middleware';

export const authRouter: ExpressRouter = Router();

// AUTH
authRouter.post('/login', validarLoginMiddleware, AuthController.IniciarSesion);
authRouter.post('/logout', verificarToken, AuthController.CerrarSesion);
authRouter.post('/verify', AuthController.VerificarUsuario);
