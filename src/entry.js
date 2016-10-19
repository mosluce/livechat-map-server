import app from './app';
import { handler } from './socket-handler';
import { init } from './libs/database';

const http = require('http');
const socketIO = require('socket.io');

init().then(() => {
    let port = process.env.PORT || 3000;
    let server = http.createServer(app);
    let io = socketIO(server);

    handler(io);

    server.listen(port, () => {
        console.log('======================');
        console.log('Server is running');
        console.log('PORT', port);
        console.log('======================');
    });
}).catch((ex) => {
    console.log(ex);
});
