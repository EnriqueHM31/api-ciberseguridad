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
import { verificarResetPasswordMiddleware } from '../middleware/verifyResetPassword.middleware';

export const passwordRouter: ExpressRouter = Router();

// PASSWORD
passwordRouter.put('/reset/:id_usuario', validarResetearPasswordMiddleware, PasswordController.ResetearContraseña);
passwordRouter.put('/change/:id_usuario', resetLimitPasswordMiddleware, validarCambiarPasswordMiddleware, PasswordController.CambiarContraseña);
passwordRouter.post('/request-reset', resetLimiterMiddleware, validarRequestResetMiddleware, PasswordController.requestReset);
passwordRouter.put('/verify-reset', resetLimiterMiddleware, validarVerifyResetMiddleware, PasswordController.verifyReset);
passwordRouter.put('/reset-password-login', resetLimitPasswordMiddleware, verificarResetPasswordMiddleware, validarResetPasswordFinalMiddleware, PasswordController.resetPassword);
