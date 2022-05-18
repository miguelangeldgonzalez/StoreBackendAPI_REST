import cors from 'cors';
import express from 'express';

import routerApiV1 from './routes/index.js';
import { errorHandler, boomErrorHandler } from './middlewares/error.handler.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

routerApiV1(app);

app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log("Initialized");
})
