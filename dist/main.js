"use strict";
const index_1 = require('./socket/index');
const http = require('http');
const database = require('./libs/database');
const app_1 = require('./app');
database.init().then(() => {
    let server = http.createServer(app_1.default);
    let port = process.env.PORT || 8080;
    new index_1.Socket(server);
    server.listen(port, () => {
        console.log("Server On ...");
    }).on('error', (err) => {
        console.log(err);
    });
}).catch((e) => {
    console.log(e);
});
//# sourceMappingURL=main.js.map