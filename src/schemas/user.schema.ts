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

export function validarUsuarioCrear(data: unknown) {
    return usuarioCrearSchema.parse(data);
}

/* ======================================================
   VALIDAR SOLO ID (para eliminar / buscar / editar)
====================================================== */

export const usuarioIdSchema = z.object({
    id_usuario: z.string({ message: 'El id es requerido' }).uuid({ message: 'El id debe ser un UUID válido' }),
});

export function validarUsuarioId(data: unknown) {
    return usuarioIdSchema.safeParse(data);
}

/* ======================================================
MODIFICAR USUARIO
- No se modifica contraseña aquí
- No se modifica id
- Debe enviar al menos un campo
====================================================== */

export const usuarioModificarSchema = z
    .object({
        nombre_usuario: z.string().min(3).max(50).optional(),

        nombre_completo: z.string().min(3).max(100).optional(),

        correo_electronico: z.string().email().optional(),

        rol: z.enum([USER_ROLE_ADMIN, USER_ROLE_USER]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Debe enviar al menos un campo para actualizar',
    });

export function validarUsuarioModificar(data: unknown) {
    return usuarioModificarSchema.safeParse(data);
}
