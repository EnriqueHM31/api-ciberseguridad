import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { TareasController } from '../controller/TareasController.controller';
import { validarCrearTareaMiddleware, validarIdTareaMiddleware, validarIdUsuarioTareaMiddleware } from '../middleware/task.middleware';
import { verificarUserMiddleware } from '../middleware/verifyAuthToken.middleware';

export const taskRouter: ExpressRouter = Router();

// TASKS
taskRouter.get('/user/:id_usuario', verificarUserMiddleware, validarIdUsuarioTareaMiddleware, TareasController.ObtenerTareasUsuario);
taskRouter.post('/', verificarUserMiddleware, validarCrearTareaMiddleware, TareasController.CrearTarea);
taskRouter.put('/:id_tarea', verificarUserMiddleware, validarIdTareaMiddleware, TareasController.ModificarTarea);
taskRouter.delete('/:id_tarea', verificarUserMiddleware, validarIdTareaMiddleware, TareasController.EliminarTarea);
