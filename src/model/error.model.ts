import { pool } from '../config/database'; // ajusta la ruta si es diferente

export interface RegistroError {
    codigo_error: string;
    mensaje_error: string;
    traza_error: string | null;
    ruta: string;
    metodo_http: string;
    id_usuario: string | null;
    direccion_ip: string | null;
}

export class ErrorModel {
    static async crear(error: RegistroError): Promise<void> {
        const sql = `
      INSERT INTO registro_errores
      (codigo_error, mensaje_error, traza_error, ruta, metodo_http, id_usuario, direccion_ip)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await pool.execute(sql, [
            error.codigo_error,
            error.mensaje_error,
            error.traza_error,
            error.ruta,
            error.metodo_http,
            error.id_usuario,
            error.direccion_ip,
        ]);
    }
}
