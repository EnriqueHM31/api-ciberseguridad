/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';

const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = jwt;
/**
 * Estructura normalizada que se utiliza en toda la API cuando un error
 * llega hasta la capa HTTP. Todos los errores internos deben convertirse
 * a este formato antes de enviarse al cliente.
 */
export interface NormalizedError {
    ok: false;
    message: string; // mensaje entendible para el cliente
    error: string; // código o nombre corto del error (útil para logs)
    statusCode: number; // código HTTP que se enviará en la respuesta
}

/**
 * Error personalizado de la aplicación.
 * Puede lanzarse desde cualquier parte del código y será interpretado
 * correctamente por `handleAppError`.
 * Permite definir explícitamente el statusCode sin depender del controller.
 */
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Helpers específicos para MySQL -----------------------------------------
 * Aquí se detectan y transforman errores propios de mysql2
 */

interface MySqlError extends Error {
    code?: string;
    errno?: number;
    sqlState?: string;
    sqlMessage?: string;
}

/**
 * Códigos de error conocidos que puede devolver MySQL.
 */
export const MYSQL_ERROR_CODES = {
    DUPLICATE_ENTRY: 'ER_DUP_ENTRY',
    DATA_TOO_LONG: 'ER_DATA_TOO_LONG',
    BAD_NULL: 'ER_BAD_NULL_ERROR',
    NO_REFERENCED_ROW: 'ER_NO_REFERENCED_ROW_2',
    ROW_REFERENCED: 'ER_ROW_IS_REFERENCED_2',
    WRONG_VALUE_COUNT: 'ER_WRONG_VALUE_COUNT_ON_ROW',
} as const;

/**
 * Tipo que define cómo se mapea cada código MySQL a un mensaje y status HTTP.
 */
type MysqlMapping = {
    [code in (typeof MYSQL_ERROR_CODES)[keyof typeof MYSQL_ERROR_CODES]]?: {
        message: string;
        statusCode: number;
    };
};

/**
 * Tabla de conversión de errores MySQL a errores normalizados.
 */
const mysqlMapping: MysqlMapping = {
    [MYSQL_ERROR_CODES.DUPLICATE_ENTRY]: {
        message: 'Registro duplicado',
        statusCode: 409,
    },
    [MYSQL_ERROR_CODES.DATA_TOO_LONG]: {
        message: 'Uno de los campos excede el tamaño permitido',
        statusCode: 400,
    },
    [MYSQL_ERROR_CODES.BAD_NULL]: {
        message: 'Faltan campos obligatorios',
        statusCode: 400,
    },
    [MYSQL_ERROR_CODES.NO_REFERENCED_ROW]: {
        message: 'El registro asociado no existe',
        statusCode: 400,
    },
    [MYSQL_ERROR_CODES.ROW_REFERENCED]: {
        message: 'No se puede eliminar porque tiene registros asociados',
        statusCode: 400,
    },
    [MYSQL_ERROR_CODES.WRONG_VALUE_COUNT]: {
        message: 'Parámetros incorrectos',
        statusCode: 400,
    },
};

/**
 * Verifica si el error recibido tiene estructura de error MySQL.
 * No depende del tipo explícito, sino de propiedades como `code`.
 */
function isMySqlError(err: unknown): err is MySqlError {
    return typeof err === 'object' && err !== null && 'code' in err && typeof (err as any).code === 'string';
}

/**
 * Convierte un error MySQL en un error normalizado para la API.
 */
function handleMySqlError(err: MySqlError): NormalizedError {
    const code = err.code as keyof typeof mysqlMapping;
    const base = mysqlMapping[code];

    if (base) {
        let message = base.message;

        // Algunos errores requieren mensajes más específicos
        if (code === MYSQL_ERROR_CODES.DUPLICATE_ENTRY) {
            if (err.sqlMessage?.includes('nombre_usuario')) {
                message = 'El nombre de usuario ya está en uso';
            } else if (err.sqlMessage?.includes('correo_electronico')) {
                message = 'El correo electrónico ya está registrado';
            }
        }

        return {
            ok: false,
            message,
            error: code,
            statusCode: base.statusCode,
        };
    }

    // Si el código no está mapeado, se trata como error genérico de base de datos
    return {
        ok: false,
        message: 'Error en la base de datos',
        error: err.code || 'MySqlError',
        statusCode: 500,
    };
}

/**
 * Helpers para JWT,- Detecta y transforma errores propios de jsonwebtoken.
 */

export const JWT_ERROR_NAMES = {
    TokenExpiredError: TokenExpiredError.name,
    JsonWebTokenError: JsonWebTokenError.name,
    NotBeforeError: NotBeforeError.name,
} as const;

type JwtErrorName = (typeof JWT_ERROR_NAMES)[keyof typeof JWT_ERROR_NAMES];

/**
 * Verifica si el error corresponde a un error de JWT
 * basándose en la propiedad `name`.
 */
function isJwtError(err: unknown): err is Error {
    return (
        typeof err === 'object' &&
        err !== null &&
        'name' in err &&
        typeof (err as any).name === 'string' &&
        Object.values(JWT_ERROR_NAMES).includes((err as any).name as JwtErrorName)
    );
}

/**
 * Convierte errores JWT en respuestas normalizadas.
 */
function handleJwtError(err: Error): NormalizedError {
    switch (err.name) {
        case JWT_ERROR_NAMES.TokenExpiredError:
            return {
                ok: false,
                message: 'El token ha expirado',
                error: err.name,
                statusCode: 401,
            };
        case JWT_ERROR_NAMES.JsonWebTokenError:
            return {
                ok: false,
                message: 'Token inválido',
                error: err.name,
                statusCode: 401,
            };
        case JWT_ERROR_NAMES.NotBeforeError:
            return {
                ok: false,
                message: 'Token todavía no válido',
                error: err.name,
                statusCode: 401,
            };
        default:
            return {
                ok: false,
                message: 'Error de autenticación',
                error: err.name,
                statusCode: 401,
            };
    }
}

/**
 * Helpers para validaciones (ej: Zod) ------------------------------------
 */

function isZodError(err: unknown): boolean {
    return typeof err === 'object' && err !== null && Array.isArray((err as any).issues);
}

/**
 * Convierte errores de validación en un formato normalizado.
 */
function handleZodError(err: any): NormalizedError {
    const issues: string[] = err.issues.map((i: any) => i.message);
    return {
        ok: false,
        message: 'Datos inválidos',
        error: issues.join('; '),
        statusCode: 400,
    };
}

interface NodemailerError extends Error {
    code?: string;
    responseCode?: number;
    command?: string;
}

/**
 * Códigos de error conocidos que puede devolver NODEMAILER (Envio de correo).
 */
const NODEMAILER_ERROR_CODES = {
    EAUTH: 'EAUTH',
    ECONNECTION: 'ECONNECTION',
    ETIMEDOUT: 'ETIMEDOUT',
};

function isNodemailerError(err: unknown): err is NodemailerError {
    return typeof err === 'object' && err !== null && 'code' in err && typeof (err as any).code === 'string';
}

function handleNodemailerError(err: NodemailerError): NormalizedError {
    switch (err.code) {
        case NODEMAILER_ERROR_CODES.EAUTH:
            return {
                ok: false,
                message: 'Error de autenticación del servidor de correo',
                error: err.code,
                statusCode: 500,
            };

        case NODEMAILER_ERROR_CODES.ECONNECTION:
            return {
                ok: false,
                message: 'No se pudo conectar al servidor de correo',
                error: err.code,
                statusCode: 503,
            };

        case NODEMAILER_ERROR_CODES.ETIMEDOUT:
            return {
                ok: false,
                message: 'Tiempo de espera agotado al enviar el correo',
                error: err.code,
                statusCode: 504,
            };

        default:
            return {
                ok: false,
                message: 'Error al enviar el correo electrónico',
                error: err.code || 'MailError',
                statusCode: 500,
            };
    }
}

/**
 * Función principal para normalizar errores.
 * Todos los catch en controllers deben enviar aquí el error original.
 * Devuelve un objeto listo para enviarse como respuesta HTTP.
 */
export function handleAppError(error: unknown): NormalizedError {
    console.log({ error });
    if (error instanceof AppError) {
        return {
            ok: false,
            message: error.message,
            error: error.name,
            statusCode: error.statusCode,
        };
    }

    if (isMySqlError(error)) {
        return handleMySqlError(error);
    }

    if (isJwtError(error)) {
        return handleJwtError(error as Error);
    }

    if (isZodError(error)) {
        return handleZodError(error);
    }

    if (isNodemailerError(error)) {
        return handleNodemailerError(error);
    }

    if (error instanceof Error) {
        return {
            ok: false,
            message: error.message || 'Error interno del servidor',
            error: error.name || 'Error',
            statusCode: 500,
        };
    }

    // Caso extremo: se lanzó algo que no es instancia de Error
    return {
        ok: false,
        message: 'Error interno del servidor',
        error: String(error),
        statusCode: 500,
    };
}
