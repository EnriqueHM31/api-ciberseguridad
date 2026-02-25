import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { UserController } from '../controller/UserController.controller';
import { validarCrearUsuarioMiddleware, validarIdUsuarioMiddleware, validarModificarUsuarioMiddleware } from '../middleware/user.middleware';
import { verificarAdminMiddleware } from '../middleware/verifyAuthToken.middleware';

export const userRouter: ExpressRouter = Router();

// USERS
userRouter.get('/', verificarAdminMiddleware, UserController.ObtenerUsuarios);
userRouter.post('/', verificarAdminMiddleware, validarCrearUsuarioMiddleware, UserController.CrearUsuario);
userRouter.put('/:id_usuario', verificarAdminMiddleware, validarIdUsuarioMiddleware, validarModificarUsuarioMiddleware, UserController.ModificarUsuario);
userRouter.delete('/:id_usuario', verificarAdminMiddleware, validarIdUsuarioMiddleware, UserController.EliminarUsuario);
