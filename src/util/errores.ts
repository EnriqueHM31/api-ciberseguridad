interface MySqlError extends Error {
    code?: string;
    sqlMessage?: string;
}
export const ERRORES_MYSQL_CODES = {
    ER_DUP_ENTRY: 'ER_DUP_ENTRY',
    ER_DATA_TOO_LONG: 'ER_DATA_TOO_LONG',
    ER_BAD_NULL_ERROR: 'ER_BAD_NULL_ERROR',
    ER_NO_REFERENCED_ROW_2: 'ER_NO_REFERENCED_ROW_2',
    ER_ROW_IS_REFERENCED_2: 'ER_ROW_IS_REFERENCED_2',
    ER_WRONG_VALUE_COUNT_ON_ROW: 'ER_WRONG_VALUE_COUNT_ON_ROW',
} as const;

export function TratarElError(error: unknown): string {
    const err = error as MySqlError;

    //  Error manual lanzado con throw new Error()
    if (!err.code) {
        return err.message || 'Error desconocido';
    }

    // Errores MySQL
    switch (err.code) {
        case ERRORES_MYSQL_CODES.ER_DUP_ENTRY:
            if (err.sqlMessage?.includes('nombre_usuario')) {
                return 'El nombre de usuario ya está en uso';
            }

            if (err.sqlMessage?.includes('correo_electronico')) {
                return 'El correo electrónico ya está registrado';
            }

            return 'Registro duplicado';

        case ERRORES_MYSQL_CODES.ER_DATA_TOO_LONG:
            return 'Uno de los campos excede el tamaño permitido';

        case ERRORES_MYSQL_CODES.ER_BAD_NULL_ERROR:
            return 'Faltan campos obligatorios';

        case ERRORES_MYSQL_CODES.ER_NO_REFERENCED_ROW_2:
            return 'El registro asociado no existe';

        case ERRORES_MYSQL_CODES.ER_ROW_IS_REFERENCED_2:
            return 'No se puede eliminar porque tiene registros asociados';

        case ERRORES_MYSQL_CODES.ER_WRONG_VALUE_COUNT_ON_ROW:
            return 'Parámetros incorrectos';
        default:
            return 'Error interno del servidor';
    }
}

export function formatearErroresZod(error: any) {
    if (!error?.issues) return error;

    // Retornamos directamente el string del mensaje
    return error.issues.map((err: any) => err.message);
}
