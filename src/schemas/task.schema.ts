import { z } from 'zod';

/* ======================================================
   SCHEMA BASE TAREA
====================================================== */

export const schemaTarea = z.object({
    id_tarea: z.string({ message: 'El id de la tarea es requerido' }).uuid({ message: 'El id debe ser un UUID válido' }),

    titulo: z
        .string({ message: 'El título es requerido' })
        .min(3, { message: 'Debe tener al menos 3 caracteres' })
        .max(100, { message: 'Máximo 100 caracteres permitidos' }),

    descripcion: z
        .string({ message: 'La descripción es requerida' })
        .min(3, { message: 'Debe tener al menos 3 caracteres' })
        .max(500, { message: 'Máximo 500 caracteres permitidos' }),

    id_usuario: z.string({ message: 'El id del usuario es requerido' }).uuid({ message: 'El id del usuario debe ser UUID válido' }),
});

/* ======================================================
   CREAR TAREA (sin id_tarea)
====================================================== */

const tareaCrearSchema = schemaTarea.omit({
    id_tarea: true,
});

export function validarTareaCrear(data: unknown) {
    return tareaCrearSchema.safeParse(data);
}

/* ======================================================
   VALIDAR ID TAREA (params)
====================================================== */

const tareaIdSchema = z.object({
    id_tarea: z.string({ message: 'El id es requerido' }).uuid({ message: 'El id debe ser un UUID válido' }),
});

export function validarTareaId(data: unknown) {
    return tareaIdSchema.safeParse(data);
}

/* ======================================================
   VALIDAR ID USUARIO (params para listar tareas)
====================================================== */

const usuarioIdSchema = z.object({
    id_usuario: z.string({ message: 'El id del usuario es requerido' }).uuid({ message: 'El id debe ser un UUID válido' }),
});

export function validarUsuarioIdTarea(data: unknown) {
    return usuarioIdSchema.safeParse(data);
}
