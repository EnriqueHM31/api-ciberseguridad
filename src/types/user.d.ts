import { RowDataPacket } from 'mysql2';

export interface User {
    id_usuario: string;
    nombre_usuario: string;
    nombre_completo: string;
    correo_electronico: string;
    telefono: string;
    contrasena: string;
    rol: string;
}

export interface UserQuery extends RowDataPacket {
    id_usuario: string;
    nombre_usuario: string;
    nombre_completo: string;
    correo_electronico: string;
    contrasena: string;
    rol: string;
}
