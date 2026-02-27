import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_RECOVERY_SECRET } from '../config';
import { JWT_EXPIRES_PASSWORD, JWT_TOKEN_PASSWORD_NAME } from '../config/constants';
import { PasswordModel } from '../model/password.model';

export class PasswordController {
    static async ResetearContraseñaAdministrador(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_usuario } = req.user as { id_usuario: string };
            const { newPassword } = req.body as { newPassword: string };

            const { data } = await PasswordModel.resetearContraseñaAdministrador(id_usuario, newPassword);

            res.status(200).json({
                ok: true,
                message: 'Contraseña reseteada correctamente',
                data: data,
                error: null,
            });
        } catch (error) {
            next(error);
        }
    }

    static async CambiarContraseña(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_usuario } = req.user as { id_usuario: string };
            const { newPassword, contrasenaActual } = req.body;

            const { data } = await PasswordModel.cambiarContraseña(id_usuario, newPassword, contrasenaActual);

            res.status(200).json({
                ok: true,
                message: 'Contraseña cambiada correctamente',
                data: data,
                error: null,
            });
        } catch (error) {
            next(error);
        }
    }
    static async requestReset(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            console.log({ email });

            const { data: dataOTP } = await PasswordModel.generarOTP(email);

            const { data: dataCorreoEnviado } = await PasswordModel.enviarCorreo(email, dataOTP);

            res.status(200).json({
                ok: true,
                message: 'Código de verificación enviado',
                data: dataCorreoEnviado,
                error: null,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
    Verificar código OTP
     */
    static async verifyReset(req: Request, res: Response, next: NextFunction) {
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
            next(error);
        }
    }
    /**
    Resetear contraseña después de verificar OTP
     */
    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, newPassword } = req.body;

            const { data } = await PasswordModel.resetearContrasenaLogin(email, newPassword);

            res.status(200).json({
                ok: true,
                message: 'Contraseña actualizada correctamente',
                data: data,
                error: null,
            });
        } catch (error) {
            next(error);
        }
    }
}
