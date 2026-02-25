import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { PasswordController } from '../controller/PasswordController.controller';
import { resetLimiter, resetLimitPassword } from '../middleware/limiteIntentos.middleware';
import { validarCambiarPassword, validarRequestReset, validarResetearPassword, validarResetPasswordFinal, validarVerifyReset } from '../middleware/password.middleware';
import { verificarResetPassword } from '../middleware/verifyResetPassword.middleware';

export const passwordRouter: ExpressRouter = Router();

// PASSWORD
passwordRouter.put('/reset/:id_usuario', validarResetearPassword, PasswordController.ResetearContraseña);
passwordRouter.put('/change/:id_usuario', resetLimitPassword, validarCambiarPassword, PasswordController.CambiarContraseña);
passwordRouter.post('/request-reset', resetLimiter, validarRequestReset, PasswordController.requestReset);
passwordRouter.put('/verify-reset', resetLimiter, validarVerifyReset, PasswordController.verifyReset);
passwordRouter.put('/reset-password-login', verificarResetPassword, validarResetPasswordFinal, PasswordController.resetPassword);
