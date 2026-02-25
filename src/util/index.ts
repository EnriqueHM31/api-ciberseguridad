import bcrypt from "bcrypt";

export function verificarContraseña(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
}