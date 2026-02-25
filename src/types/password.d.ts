import { RowDataPacket } from 'mysql2';

export interface PasswordReset {
    id: string;
    email: string;
    otp: string;
    expires_at: Date;
    verified: boolean;
}

export interface PasswordResetQuery extends RowDataPacket {
    id: string;
    email: string;
    otp: string;
    expires_at: Date;
    verified: boolean;
}
