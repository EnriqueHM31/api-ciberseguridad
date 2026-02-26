import type { ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/database';
import type { Tarea, TareaQuery } from '../types/task';

export class TareaModel {
    static async ObtenerTareasUsuario(id_usuario: string) {
        const [rows] = await pool.execute<TareaQuery[]>(
            `SELECT id_tarea, titulo, descripcion, id_usuario, fecha_creacion, completada FROM tareas WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        return { data: rows };
    }

    static async crearTarea(tarea: Omit<Tarea, 'id_tarea' | 'fecha_creacion' | 'completada'>) {
        const id_tarea = crypto.randomUUID();

        await pool.execute(`INSERT INTO tareas (id_tarea, titulo, descripcion, id_usuario) VALUES (?, ?, ?, ?)`, [
            id_tarea,
            tarea.titulo,
            tarea.descripcion,
            tarea.id_usuario,
        ]);

        const [rows] = await pool.execute<TareaQuery[]>(
            `SELECT id_tarea, titulo, descripcion, id_usuario, fecha_creacion, completada FROM tareas WHERE BINARY id_tarea = ?`,
            [id_tarea],
        );

        if (!rows[0]) {
            throw new Error('No se pudo crear la tarea');
        }

        return { data: rows[0] };
    }

    static async modificarTarea(id_tarea: string, completada: 1 | 0) {
        const [result] = await pool.execute<ResultSetHeader>(`UPDATE tareas SET completada = ? WHERE BINARY id_tarea = ?`, [completada, id_tarea]);

        if (result.affectedRows === 0) {
            throw new Error('La tarea no existe');
        }

        const [tareaModificada] = await pool.execute<TareaQuery[]>(
            `SELECT id_tarea, titulo, descripcion, id_usuario, fecha_creacion, completada FROM tareas WHERE BINARY id_tarea = ?`,
            [id_tarea],
        );

        if (!tareaModificada[0]) {
            throw new Error('La tarea no existe');
        }

        return { data: tareaModificada[0] };
    }

    static async eliminarTarea(id_tarea: string) {
        const [result] = await pool.execute<ResultSetHeader>(`DELETE FROM tareas WHERE BINARY id_tarea = ?`, [id_tarea]);

        if (result.affectedRows === 0) {
            throw new Error('La tarea no existe');
        }

        return { data: id_tarea };
    }
}
