import { Socket } from './socket/index';
import * as http from 'http';

import * as database from './libs/database';
import app from './app';

database.init().then(() => {
    let server = http.createServer(app);
    let port = process.env.PORT || 8080;

    new Socket(server);

    server.listen(port, () => {
        console.log("Server On ...");
    }).on('error', (err) => {
        console.log(err);
    });

}).catch((e) => {
    console.log(e);
})



