'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _socketHandler = require('./socket-handler');

var _database = require('./libs/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
var socketIO = require('socket.io');

(0, _database.init)().then(function () {
    var port = process.env.PORT || 3000;
    var server = http.createServer(_app2.default);
    var io = socketIO(server);

    (0, _socketHandler.handler)(io);

    server.listen(port, function () {
        console.log('======================');
        console.log('Server is running');
        console.log('PORT', port);
        console.log('======================');
    });
}).catch(function (ex) {
    console.log(ex);
});
//# sourceMappingURL=entry.js.map