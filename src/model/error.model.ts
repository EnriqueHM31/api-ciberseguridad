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
    private static readonly LIMITE_MAXIMO = 1000;

    static async crear(error: RegistroError): Promise<void> {
        const sqlInsert = `
      INSERT INTO registro_errores
      (codigo_error, mensaje_error, traza_error, ruta, metodo_http, id_usuario, direccion_ip)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        await pool.execute(sqlInsert, [
            error.codigo_error,
            error.mensaje_error,
            error.traza_error,
            error.ruta,
            error.metodo_http,
            error.id_usuario,
            error.direccion_ip,
        ]);

        await this.limpiarExcedentes();
    }

    private static async limpiarExcedentes(): Promise<void> {
        const sqlDelete = `
        DELETE FROM registro_errores
        WHERE id_error NOT IN (
            SELECT id_error FROM (
                SELECT id_error
                FROM registro_errores
                ORDER BY fecha_registro DESC
                LIMIT ${this.LIMITE_MAXIMO}
            ) AS ultimos
        )
    `;

        await pool.query(sqlDelete);
    }
}
