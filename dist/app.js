'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var body = require('body-parser');
var cookie = require('cookie-parser');

var app = express();
app.use(body.json());
app.use(body.urlencoded({
    extended: false
}));
app.use(cookie());

app.use('/', _routes2.default);

exports.default = app;
//# sourceMappingURL=app.js.map