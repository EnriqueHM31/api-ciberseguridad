import { DB_HOST_DEFAULT, DB_NAME_DEFAULT, DB_PASSWORD_DEFAULT, DB_PORT_DEFAULT, DB_USER_DEFAULT } from './constants';

export const PORT = process.env.PORT || 4000;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_RECOVERY_SECRET = process.env.JWT_RECOVERY_SECRET as string;
export const EMAIL_USER = process.env.EMAIL_USER as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

/* -----------------------------------------------------------------------------
DATABASE
----------------------------------------------------------------------------- */

export const DB_HOST = process.env.DB_HOST || DB_HOST_DEFAULT;
export const DB_PORT = process.env.DB_PORT || DB_PORT_DEFAULT;
export const DB_USER = process.env.DB_USER || DB_USER_DEFAULT;
export const DB_PASSWORD = process.env.DB_PASSWORD || DB_PASSWORD_DEFAULT;
export const DB_NAME = process.env.DB_NAME || DB_NAME_DEFAULT;

/* -----------------------------------------------------------------------------
USER    
----------------------------------------------------------------------------- */

export const USER_ROLE_ADMIN = 'admin';
export const USER_ROLE_USER = 'user';
