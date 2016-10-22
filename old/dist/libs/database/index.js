'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.init = init;

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

mongoose.Promise = _promise2.default;

/**
 * 初始化 mongoose
 * @export
 * @returns Promise<mongoose.Connection>
 */
function init() {
    return new _promise2.default(function (resolve, reject) {
        var url = process.env.MONGODB_URI || 'mongodb://localhost/mos-livemap';
        var conn = mongoose.connection;

        conn.once('open', function () {
            console.log('Mongoose default connection open to ' + url);

            _models.Account.init();
            _models.Online.init();

            resolve(conn);
        });

        conn.on('error', function (error) {
            return reject(error);
        });

        // When the connection is disconnected
        conn.on('disconnected', function () {
            console.log('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function () {
            conn.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        mongoose.connect(url);
    });
}
//# sourceMappingURL=index.js.map