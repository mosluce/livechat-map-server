import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser')
import routes from './routes';

let app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

export default app;