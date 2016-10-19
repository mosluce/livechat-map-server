'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Online = exports.Account = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = exports.Account = function () {
    function Account() {
        (0, _classCallCheck3.default)(this, Account);
    }

    (0, _createClass3.default)(Account, null, [{
        key: 'init',
        value: function init() {
            var schema = new mongoose.Schema({
                uid: {
                    type: String,
                    required: true
                },
                avatar: {
                    type: String
                },
                displayName: {
                    type: String
                },
                sequence: {
                    type: Number,
                    required: true,
                    default: 0
                },
                location: {
                    'type': {
                        type: String,
                        default: "Point"
                    },
                    coordinates: [{
                        type: "Number"
                    }]
                }
            });

            return mongoose.model('Account', schema);
        }
    }]);
    return Account;
}();

var Online = exports.Online = function () {
    function Online() {
        (0, _classCallCheck3.default)(this, Online);
    }

    (0, _createClass3.default)(Online, null, [{
        key: 'init',
        value: function init() {
            var schema = new mongoose.Schema({
                sid: String,
                uid: String,
                account: {
                    type: Schema.Types.ObjectId,
                    ref: 'Account'
                },
                location: {
                    'type': {
                        type: String,
                        default: "Point"
                    },
                    coordinates: [{
                        type: "Number"
                    }]
                }
            });

            return mongoose.model('Online', schema);
        }
    }]);
    return Online;
}();
//# sourceMappingURL=index.js.map