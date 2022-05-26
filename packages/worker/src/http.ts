import express from 'express';
import pinoHttp from 'pino-http';

const app = express();
app.use(pinoHttp());

app.get('/', (req, res) => {
    res.send("OK");
});

app.get('/status', (req, res) => {
    res.send("OK");
});

export default app;