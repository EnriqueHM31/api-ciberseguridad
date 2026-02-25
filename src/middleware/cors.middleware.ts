import cors from 'cors';

/*
    CORS (Cross-Origin Resource Sharing)

    En ciberseguridad web, CORS controla qué dominios externos
    pueden consumir nuestra API desde el navegador.

    Sin esta configuración, cualquier sitio web podría intentar
    hacer peticiones a nuestro backend usando el navegador del usuario.
*/

const ORIGENES_PERMITIDAS = [
    'http://localhost:5173', // Frontend en desarrollo (HTTP)
    'https://localhost:5173', // Frontend en desarrollo (HTTPS)
];

export function createCorsMiddleware() {
    return cors({
        origin: (origin, callback) => {
            /*
                1) Si no hay origin:
                - Puede ser Postman, curl o SSR.
                - No es un navegador, por lo tanto no aplica política CORS.
            */
            if (!origin) {
                return callback(null, true);
            }

            /*
                2) Validamos que el dominio esté en la lista blanca.
                - Esto previene que sitios maliciosos consuman la API
                - desde el navegador de la víctima.
            */
            if (ORIGENES_PERMITIDAS.includes(origin)) {
                return callback(null, true);
            }

            /*
                3) Si no está permitido, se bloquea.
                - El navegador cancelará la petición.
            */
            return callback(new Error('Origen no permitido por CORS'));
        },

        /*
            Métodos HTTP permitidos.
            Reducirlos limita superficie de ataque.
        */
        methods: ['GET', 'POST', 'PUT', 'DELETE'],

        /*
            Permite enviar cookies y headers de autenticación.
            Necesario si usas JWT en cookies.
        */
        credentials: true,

        /*
            Headers que el cliente puede enviar.
            Restringirlos evita manipulación innecesaria.
        */
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
}
