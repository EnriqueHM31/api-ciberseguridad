import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UUID } from 'node:crypto';
import { JWT_RECOVERY_SECRET } from '../config';
import { JWT_EXPIRES_PASSWORD, JWT_TOKEN_PASSWORD_NAME } from '../config/constants';
import { PasswordModel } from '../model/password.model';
import { TratarElError } from '../util/errores';

export class PasswordController {
    static async ResetearContraseña(req: Request, res: Response) {
        try {
            const { id_usuario } = req.params as { id_usuario: string };
            const { newPassword } = req.body as { newPassword: string };

            const { data } = await PasswordModel.resetearContraseña(id_usuario, newPassword);

            res.status(200).json({
                ok: true,
                message: 'Contraseña reseteada correctamente',
                data: data,
                error: null,
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: TratarElError(error),
                data: null,
                error: 'Error interno del servidor',
            });
        }
    }

    static async CambiarContraseña(req: Request, res: Response) {
        try {
            const { id_usuario } = req.params as { id_usuario: UUID };
            const { newPassword, contrasenaActual } = req.body;

            const { data } = await PasswordModel.cambiarContraseña(id_usuario, newPassword, contrasenaActual);

            res.status(200).json({
                ok: true,
                message: 'Contraseña cambiada correctamente',
                data: data,
                error: null,
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: TratarElError(error),
                data: null,
                error: 'Error en la petición',
            });
        }
    }
    static async requestReset(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const { data: dataOTP } = await PasswordModel.generarOTP(email);

            const { data: dataCorreoEnviado } = await PasswordModel.enviarCorreo(email, dataOTP);

            res.status(200).json({
                ok: true,
                message: 'Código de verificación enviado',
                data: dataCorreoEnviado,
                error: null,
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: TratarElError(error),
                data: null,
                error: 'Error interno del servidor',
            });
        }
    }

    /**
    Verificar código OTP
     */
    static async verifyReset(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;

            const { data } = await PasswordModel.verificarOTP(email, otp);

            const recoveryToken = jwt.sign({ email, stage: 'RECOVERY_AUTH' }, JWT_RECOVERY_SECRET!, { expiresIn: JWT_EXPIRES_PASSWORD });

            res.cookie(JWT_TOKEN_PASSWORD_NAME, recoveryToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 5 * 60 * 1000,
            });

            res.status(200).json({
                ok: true,
                message: 'Código verificado correctamente',
                data: data,
                error: null,
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: TratarElError(error),
                data: null,
                error: 'Error interno del servidor',
            });
        }
    }
    /**
    Resetear contraseña después de verificar OTP
     */
    static async resetPassword(req: Request, res: Response) {
        try {
            const { email, newPassword } = req.body;

            const { data } = await PasswordModel.resetearContrasenaLogin(email, newPassword);

            res.status(200).json({
                ok: true,
                message: 'Contraseña actualizada correctamente',
                data: null,
                error: data,
            });
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: TratarElError(error),
                data: null,
                error: 'Error interno del servidor',
            });
        }
    }
}
