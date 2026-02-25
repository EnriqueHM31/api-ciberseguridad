import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { TareasController } from '../controller/TareasController.controller';
import { validarCrearTareaMiddleware, validarIdTareaMiddleware, validarIdUsuarioTareaMiddleware } from '../middleware/task.middleware';
import { verificarUserMiddleware } from '../middleware/verifyAuthToken.middleware';

export const taskRouter: ExpressRouter = Router();

// RUTA PARA QUE EL USUARIO PUEDA OBTENER TODOS LOS TAREAS DE UN USUARIO
taskRouter.get('/user/:id_usuario', verificarUserMiddleware, validarIdUsuarioTareaMiddleware, TareasController.ObtenerTareasUsuario);

// RUTA PARA QUE EL USUARIO PUEDA CREAR UN TAREA
taskRouter.post('/', verificarUserMiddleware, validarCrearTareaMiddleware, TareasController.CrearTarea);

// RUTA PARA QUE EL USUARIO PUEDA MODIFICAR UN TAREA (MARCAR COMO COMPLETADA)
taskRouter.put('/:id_tarea', verificarUserMiddleware, validarIdTareaMiddleware, TareasController.ModificarTarea);

// RUTA PARA QUE EL USUARIO PUEDA ELIMINAR UN TAREA
taskRouter.delete('/:id_tarea', verificarUserMiddleware, validarIdTareaMiddleware, TareasController.EliminarTarea);
