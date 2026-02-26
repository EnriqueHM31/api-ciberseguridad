import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { PasswordController } from '../controller/PasswordController.controller';
import { resetLimiterMiddleware, resetLimitPasswordMiddleware } from '../middleware/limiteIntentos.middleware';
import {
    validarCambiarPasswordMiddleware,
    validarRequestResetMiddleware,
    validarResetearPasswordMiddleware,
    validarResetPasswordFinalMiddleware,
    validarVerifyResetMiddleware,
} from '../middleware/password.middleware';
import { verificarAdminMiddleware, verificarUserMiddleware } from '../middleware/verifyAuthToken.middleware';
import { verificarTokenResetPasswordMiddleware } from '../middleware/verifyResetPassword.middleware';

export const passwordRouter: ExpressRouter = Router();

// RUTA PARA QUE EL ADMINISTRADOR PUEDA RESETEAR LA CONTRASEÑA DE UN USUARIO
passwordRouter.put(
    '/reset/:id_usuario',
    verificarAdminMiddleware,
    validarResetearPasswordMiddleware,
    PasswordController.ResetearContraseñaAdministrador,
);

// RUTA PARA QUE EL USUARIO PUEDA RESETEAR LA CONTRASEÑA DE SU PROPIO USUARIO
passwordRouter.put(
    '/change/:id_usuario',
    verificarUserMiddleware,
    resetLimitPasswordMiddleware,
    validarCambiarPasswordMiddleware,
    PasswordController.CambiarContraseña,
);

// RUTA PARA QUE EL USUARIO PUEDA REQUERIR UN CÓDIGO DE RECUPERACIÓN
passwordRouter.post('/request-reset', resetLimiterMiddleware, validarRequestResetMiddleware, PasswordController.requestReset);

// RUTA PARA QUE EL USUARIO PUEDA VERIFICAR UN CÓDIGO DE RECUPERACIÓN
passwordRouter.put('/verify-reset', resetLimiterMiddleware, validarVerifyResetMiddleware, PasswordController.verifyReset);

// RUTA PARA QUE EL USUARIO PUEDA RESETEAR LA CONTRASEÑA DESDE EL LOGIN (SIN AUTENTICARSE)
passwordRouter.put(
    '/reset-password-login',
    verificarTokenResetPasswordMiddleware,
    resetLimitPasswordMiddleware,
    validarResetPasswordFinalMiddleware,
    PasswordController.resetPassword,
);
