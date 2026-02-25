import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { UserController } from '../controller/UserController.controller';
import { validarCrearUsuarioMiddleware, validarIdUsuarioMiddleware, validarModificarUsuarioMiddleware } from '../middleware/user.middleware';
import { verificarAdminMiddleware } from '../middleware/verifyAuthToken.middleware';

export const userRouter: ExpressRouter = Router();

// RUTA PARA QUE EL ADMINISTRADOR PUEDA OBTENER TODOS LOS USUARIOS
userRouter.get('/', verificarAdminMiddleware, UserController.ObtenerUsuarios);

// RUTA PARA QUE EL ADMINISTRADOR PUEDA CREAR UN USUARIO
userRouter.post('/', verificarAdminMiddleware, validarCrearUsuarioMiddleware, UserController.CrearUsuario);

// RUTA PARA QUE EL ADMINISTRADOR PUEDA MODIFICAR UN USUARIO
userRouter.put(
    '/:id_usuario',
    verificarAdminMiddleware,
    validarIdUsuarioMiddleware,
    validarModificarUsuarioMiddleware,
    UserController.ModificarUsuario,
);
// RUTA PARA QUE EL ADMINISTRADOR PUEDA ELIMINAR UN USUARIO
userRouter.delete('/:id_usuario', verificarAdminMiddleware, validarIdUsuarioMiddleware, UserController.EliminarUsuario);
