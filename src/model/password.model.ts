import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD, EMAIL_USER } from '../config';
import { pool } from '../config/database';
import type { PasswordResetQuery } from '../types/password';
import type { UserQuery } from '../types/user';

export class PasswordModel {
    static async resetearContraseña(id_usuario: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);
        await pool.execute('UPDATE usuarios SET contrasena = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE BINARY id_usuario = ?', [passwordHash, id_usuario]);

        const [usuarioActualizado] = await pool.execute<UserQuery[]>(
            `SELECT id_usuario, nombre_usuario, nombre_completo, correo_electronico, fecha_creacion, rol FROM usuarios WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        if (usuarioActualizado.length === 0) {
            throw new Error('El usuario no existe');
        }

        return { data: usuarioActualizado[0] };
    }

    static async cambiarContraseña(id_usuario: string, password: string, passwor_confirmar: string) {
        const [usuarioActualizar] = await pool.execute<UserQuery[]>(`SELECT id_usuario, contrasena FROM usuarios WHERE BINARY id_usuario = ?`, [id_usuario]);

        if (usuarioActualizar.length === 0) {
            throw new Error('El usuario no existe');
        }

        if (!usuarioActualizar[0]?.contrasena) {
            throw new Error('La contraseña no existe');
        }

        const passwordVerified = await bcrypt.compare(passwor_confirmar, usuarioActualizar[0].contrasena);

        if (!passwordVerified) {
            throw new Error('Contraseña incorrecta');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await pool.execute('UPDATE usuarios SET contrasena = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE BINARY id_usuario = ?', [passwordHash, id_usuario]);

        const [usuarioActualizado] = await pool.execute<UserQuery[]>(
            `SELECT id_usuario, nombre_usuario, nombre_completo, correo_electronico, fecha_creacion, rol FROM usuarios WHERE BINARY id_usuario = ?`,
            [id_usuario],
        );

        if (usuarioActualizado.length === 0) {
            throw new Error('El usuario no existe');
        }

        return { data: usuarioActualizado[0] };
    }
    static async generarOTP(correo: string) {
        const [usuario] = await pool.execute<UserQuery[]>(`SELECT id_usuario, correo_electronico FROM usuarios WHERE BINARY correo_electronico = ?`, [correo]);

        if (usuario.length === 0) {
            throw new Error('No se pudo generar el código de verificación');
        }

        const codigoOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const fechaExpiracion = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

        // Eliminar códigos anteriores
        await pool.execute(`DELETE FROM recuperacion_contrasena WHERE BINARY correo_electronico = ?`, [correo]);

        const id_recuperacion = crypto.randomUUID();

        await pool.execute(`INSERT INTO recuperacion_contrasena (id, correo_electronico, codigo_otp, fecha_expiracion, verificado, fecha_creacion) VALUES (?, ?, ?, ?, false, CURRENT_TIMESTAMP)`, [
            id_recuperacion,
            correo,
            codigoOTP,
            fechaExpiracion,
        ]);

        return { data: codigoOTP };
    }
    static async verificarOTP(correo: string, codigo: string) {
        const [registro] = await pool.execute<PasswordResetQuery[]>(`SELECT id, codigo_otp, fecha_expiracion, verificado FROM recuperacion_contrasena WHERE BINARY correo_electronico = ?`, [correo]);

        if (registro.length === 0) {
            throw new Error('No existe solicitud válida');
        }

        const datosOTP = registro[0] as PasswordResetQuery;

        if (datosOTP.verificado) {
            throw new Error('El código ya ha sido verificado');
        }

        if (datosOTP.codigo_otp !== codigo) {
            throw new Error('Código incorrecto');
        }

        if (new Date(datosOTP.fecha_expiracion) < new Date()) {
            throw new Error('El código ha expirado');
        }

        await pool.execute(`UPDATE recuperacion_contrasena SET verificado = true WHERE id = ?`, [datosOTP.id]);

        return { data: true };
    }
    static async resetearContrasenaLogin(correo: string, nuevaContrasena: string) {
        const [registro] = await pool.execute<any[]>(`SELECT id, verificado FROM recuperacion_contrasena WHERE BINARY correo_electronico = ?`, [correo]);

        if (registro.length === 0) {
            throw new Error('No existe solicitud válida');
        }

        if (!registro[0].verificado) {
            throw new Error('El código no ha sido verificado');
        }

        const passwordHash = await bcrypt.hash(nuevaContrasena, 10);

        await pool.execute(`UPDATE usuarios SET contrasena = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE BINARY correo_electronico = ?`, [passwordHash, correo]);

        // Eliminar el registro después de usarlo
        await pool.execute(`DELETE FROM recuperacion_contrasena WHERE BINARY correo_electronico = ?`, [correo]);

        return { data: true };
    }

    static async enviarCorreo(correoDestino: string, codigoOTP: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Soporte" <${EMAIL_USER}>`,
            to: correoDestino,
            subject: 'Código de recuperación de contraseña',
            html: `
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0f19; padding:60px 0; font-family: Arial, Helvetica, sans-serif;">
  <tr>
    <td align="center">
      
      <table width="520" cellpadding="0" cellspacing="0" style="background:#111827; border-radius:14px; padding:50px 40px; border:1px solid #1f2937;">
        
        <tr>
          <td align="center" style="padding-bottom:25px;">
            <h2 style="margin:0; color:#ffffff; font-size:22px; font-weight:600; letter-spacing:0.5px;">
              Recuperación de contraseña
            </h2>
          </td>
        </tr>

        <tr>
          <td style="color:#9ca3af; font-size:14px; text-align:center; padding-bottom:35px; line-height:1.6;">
            Hemos recibido una solicitud para restablecer tu contraseña.
            Utiliza el siguiente código de verificación para continuar:
          </td>
        </tr>

        <tr>
          <td align="center" style="padding-bottom:35px;">
            <div style="
              display:inline-block;
              background:#0f172a;
              border:1px solid #1e3a8a;
              color:#3b82f6;
              padding:18px 35px;
              font-size:30px;
              letter-spacing:10px;
              border-radius:12px;
              font-weight:700;
            ">
              ${codigoOTP}
            </div>
          </td>
        </tr>

        <tr>
          <td style="color:#6b7280; font-size:13px; text-align:center; padding-bottom:25px;">
            Este código es válido por <strong style="color:#ffffff;">10 minutos</strong>.
          </td>
        </tr>

        <tr>
          <td style="border-top:1px solid #1f2937; padding-top:25px; font-size:12px; color:#6b7280; text-align:center; line-height:1.5;">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
            <br/><br/>
            © ${new Date().getFullYear()} Tu Plataforma. Todos los derechos reservados.
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
`,
        };

        await transporter.sendMail(mailOptions);

        return { data: true };
    }
}
