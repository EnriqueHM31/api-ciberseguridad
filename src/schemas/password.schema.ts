import { z } from 'zod';

/* ======================================================
   VALIDACIONES BASE
====================================================== */

const uuidSchema = z.string({ message: 'El id es obligatorio' }).uuid({ message: 'El id debe ser un UUID válido' });

const passwordSchema = z
    .string({ message: 'La contraseña es obligatoria' })
    .min(8, { message: 'Debe tener al menos 8 caracteres' })
    .max(100, { message: 'Máximo 100 caracteres permitidos' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
    .regex(/[a-z]/, { message: 'Debe contener al menos una minúscula' })
    .regex(/[0-9]/, { message: 'Debe contener al menos un número' });

const emailSchema = z.string({ message: 'El correo es obligatorio' }).email({ message: 'Debe ser un correo válido' });

/* ======================================================
Resetear contraseña por ID (admin)
====================================================== */

export const resetearPasswordSchema = z.object({
    id_usuario: uuidSchema,
    newPassword: passwordSchema,
});

/* ======================================================
Cambiar contraseña autenticado
====================================================== */

export const cambiarPasswordSchema = z.object({
    id_usuario: uuidSchema,
    newPassword: passwordSchema,
    contrasenaActual: z.string({ message: 'La contraseña actual es obligatoria' }),
});

/* ======================================================
Solicitar OTP
====================================================== */

export const requestResetSchema = z.object({
    email: emailSchema,
});

/* ======================================================
Verificar OTP
====================================================== */

export const verifyResetSchema = z.object({
    email: emailSchema,
    otp: z.string({ message: 'El código OTP es obligatorio' }).length(6, { message: 'El OTP debe tener 6 caracteres' }),
});

/* ======================================================
Reset password después de OTP
====================================================== */

export const resetPasswordFinalSchema = z.object({
    email: emailSchema,
    newPassword: passwordSchema,
});
