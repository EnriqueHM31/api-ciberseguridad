import { RowDataPacket } from 'mysql2';

export interface TareaQuery extends RowDataPacket {
    id_tarea: string;
    titulo: string;
    descripcion: string;
    id_usuario: string;
    fecha_creacion: string;
    completada: 1 | 0;
}

export interface Tarea {
    id_tarea: string;
    titulo: string;
    descripcion: string;
    id_usuario: string;
    fecha_creacion: string;
    completada: 1 | 0;
}
