import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { UserController } from '../controller/UserController.controller';
import { validarCrearUsuarioMiddleware, validarIdUsuarioMiddleware, validarModificarUsuarioMiddleware } from '../middleware/user.middleware';
import { verificarAdmin } from '../middleware/verifyAuthToken.middleware';

export const userRouter: ExpressRouter = Router();

// USERS
userRouter.get('/', verificarAdmin, UserController.ObtenerUsuarios);
userRouter.post('/', verificarAdmin, validarCrearUsuarioMiddleware, UserController.CrearUsuario);
userRouter.put('/:id_usuario', verificarAdmin, validarIdUsuarioMiddleware, validarModificarUsuarioMiddleware, UserController.ModificarUsuario);
userRouter.delete('/:id_usuario', verificarAdmin, validarIdUsuarioMiddleware, UserController.EliminarUsuario);
