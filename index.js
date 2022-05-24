const cors = require('cors');
const express = require('express');

const routerApiV1 = require('./routes/index.js');
const { logErrors, 
        errorHandler, 
        boomErrorHandler, 
        ormErrorHandler,
        multerErrorHandler } = require('./middlewares/error.handler.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

require('./utils/auth/');
routerApiV1(app);

app.use(multerErrorHandler);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
    console.log("Initialized");
})
