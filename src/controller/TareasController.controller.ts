import type { Request, Response } from 'express';
import { TareaModel } from '../model/tarea.model';
import { TratarElError } from '../util/errores';

export class TareasController {
    static async ObtenerTareasUsuario(req: Request, res: Response) {
        try {
            const { id_usuario } = req.params as { id_usuario: string };
            const { data } = await TareaModel.ObtenerTareasUsuario(id_usuario);
            res.status(200).json({ ok: true, message: 'Listado de tareas del usuario', data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }

    static async CrearTarea(req: Request, res: Response) {
        try {
            const { titulo, descripcion, id_usuario } = req.body;

            const { data } = await TareaModel.crearTarea({ titulo, descripcion, id_usuario });

            res.status(201).json({ ok: true, message: 'Tarea creada correctamente', data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }

    static async ModificarTarea(req: Request, res: Response) {
        try {
            const { id_tarea } = req.params as { id_tarea: string };

            const { data } = await TareaModel.modificarTarea(id_tarea, 1);

            res.status(200).json({ ok: true, message: 'Datos de la tarea actualizados correctamente', data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }

    static async EliminarTarea(req: Request, res: Response) {
        try {
            const { id_tarea } = req.params as { id_tarea: string };
            const { data } = await TareaModel.eliminarTarea(id_tarea);
            res.status(200).json({ ok: true, message: 'Tarea eliminado correctamente', data: data, error: null });
        } catch (error) {
            res.status(500).json({ ok: false, message: 'Error interno del servidor', data: null, error: TratarElError(error) });
        }
    }
}
