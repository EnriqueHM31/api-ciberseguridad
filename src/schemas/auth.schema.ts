import { z } from 'zod';

/* ======================================================
LOGIN
====================================================== */

export const loginSchema = z.object({
    username: z
        .string({ message: 'El usuario es obligatorio' })
        .min(3, { message: 'Debe tener al menos 3 caracteres' })
        .max(50, { message: 'Máximo 50 caracteres permitidos' }),

    password: z.string({ message: 'La contraseña es obligatoria' }),
});
