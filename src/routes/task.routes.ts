import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { TareasController } from '../controller/TareasController.controller';
import { validarCrearTareaMiddleware, validarIdTareaMiddleware, validarIdUsuarioTareaMiddleware } from '../middleware/task.middleware';
import { verificarUser } from '../middleware/verifyAuthToken.middleware';

export const taskRouter: ExpressRouter = Router();

// TASKS
taskRouter.get('/user/:id_usuario', verificarUser, validarIdUsuarioTareaMiddleware, TareasController.ObtenerTareasUsuario);
taskRouter.post('/', verificarUser, validarCrearTareaMiddleware, TareasController.CrearTarea);
taskRouter.put('/:id_tarea', verificarUser, validarIdTareaMiddleware, TareasController.ModificarTarea);
taskRouter.delete('/:id_tarea', verificarUser, validarIdTareaMiddleware, TareasController.EliminarTarea);
