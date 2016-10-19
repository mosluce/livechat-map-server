import routes from './routes';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');

let app = express();
app.use(body.json());
app.use(body.urlencoded({
    extended: false
}));
app.use(cookie());

app.use('/', routes);

export default app;