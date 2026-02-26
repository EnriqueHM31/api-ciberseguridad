import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id_usuario: string;
                rol?: string;
            };
        }
    }
}

export {};
