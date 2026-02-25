import https from 'https';
import fs from 'fs';
import app from './app';
import { PORT } from './config/index';
import { testDatabaseConnection } from './config/database';

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
};
testDatabaseConnection();

https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ HTTPS API corriendo en https://localhost:${PORT}`);
});
