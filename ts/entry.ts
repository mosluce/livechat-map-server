import http = require('http');
import app from './app';
import db = require('./libs/database');
import socketIO = require('socket.io');
import sinch = require('./libs/sinch');
import mongoose = require('mongoose');
import socket = require('./socket');

(async () => {
    try {
        await db.init();

        let server = http.createServer(app);
        let io = socketIO(server);
        let port = process.env.PORT || 3000;

        server.listen(port, () => {
            console.log(`server is listening on port: ${port}`);
        });

        io.on('connection', socket.handler(io));
    } catch (e) {
        console.log(e);
    }
})();