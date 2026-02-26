import { z } from 'zod';
import { USER_ROLE_ADMIN, USER_ROLE_USER } from '../config';

/* ======================================================
SCHEMA BASE USUARIO
====================================================== */

export const schemaUsuario = z.object({
    id_usuario: z.string({ message: 'El id es requerido' }).uuid({ message: 'El id debe ser un UUID válido' }),

    nombre_usuario: z
        .string({ message: 'El nombre de usuario es requerido' })
        .min(3, { message: 'Debe tener al menos 3 caracteres' })
        .max(50, { message: 'Máximo 50 caracteres permitidos' }),

    nombre_completo: z
        .string({ message: 'El nombre completo es requerido' })
        .min(3, { message: 'Debe tener al menos 3 caracteres' })
        .max(100, { message: 'Máximo 100 caracteres permitidos' }),

    telefono: z
        .string({ message: 'El teléfono es requerido' })
        .trim()
        .regex(/^[1-9]\d{9,14}$/, {
            message: 'Debe estar en formato internacional (+ y 10–15 dígitos)',
        }),

    correo_electronico: z.string({ message: 'El correo es requerido' }).email({ message: 'Debe ser un correo válido' }),

    contrasena: z
        .string({ message: 'La contraseña es requerida' })
        .min(8, { message: 'Debe tener al menos 8 caracteres' })
        .max(100, { message: 'Máximo 100 caracteres permitidos' }),

    rol: z.enum([USER_ROLE_ADMIN, USER_ROLE_USER], {
        message: 'El rol no es válido',
    }),
});

/* ======================================================
CREAR USUARIO (sin id_usuario)
====================================================== */

export const usuarioCrearSchema = schemaUsuario.omit({
    id_usuario: true,
});

/* ======================================================
   VALIDAR SOLO ID (para eliminar / buscar / editar)
====================================================== */

export const usuarioIdSchema = z.object({
    id_usuario: z.string({ message: 'El id es requerido' }).uuid({ message: 'El id debe ser un UUID válido' }),
});

/* ======================================================
MODIFICAR USUARIO
- No se modifica contraseña aquí
- No se modifica id
- Debe enviar al menos un campo
====================================================== */

export const usuarioModificarSchema = z
    .object({
        nombre_usuario: z
            .string({ message: 'El nombre de usuario es requerido' })
            .min(3, { message: 'Debe tener al menos 3 caracteres' })
            .max(50, { message: 'Máximo 50 caracteres permitidos' })
            .optional(),

        nombre_completo: z
            .string({ message: 'El nombre completo es requerido' })
            .min(3, { message: 'Debe tener al menos 3 caracteres' })
            .max(100, { message: 'Máximo 100 caracteres permitidos' })
            .optional(),

        correo_electronico: z.string({ message: 'El correo es requerido' }).email({ message: 'Debe ser un correo válido' }).optional(),

        telefono: z
            .string({ message: 'El teléfono es requerido' })
            .trim()
            .regex(/^[1-9]\d{9,14}$/, {
                message: 'Debe estar en formato internacional (+ y 10–15 dígitos)',
            }),

        rol: z.enum([USER_ROLE_ADMIN, USER_ROLE_USER], { message: 'El rol no es válido' }).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debe enviar al menos un campo para actualizar',
    });
