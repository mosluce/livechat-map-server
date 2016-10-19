'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.handler = handler;

var _firebase = require('../libs/firebase');

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

/**
 * @param {SocketIO.Server} io
 */
function handler(io) {

    /**
     * @param {SocketIO.Socket} socket
     */
    var connection = function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(socket) {
            var _this = this;

            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;
                            return _context5.delegateYield(_regenerator2.default.mark(function _callee4() {
                                var Account, Online, firebasetoken, fireuser, sid, uid, account, online, list;
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                Account = mongoose.connection.model('Account');
                                                Online = mongoose.connection.model('Online');
                                                firebasetoken = socket.handshake.headers.firebasetoken;
                                                _context4.next = 5;
                                                return _firebase2.default.auth().verifyIdToken(firebasetoken);

                                            case 5:
                                                fireuser = _context4.sent;
                                                sid = socket.id;
                                                uid = fireuser.uid;
                                                _context4.next = 10;
                                                return Account.findOne({ uid: uid });

                                            case 10:
                                                account = _context4.sent;

                                                if (account) {
                                                    _context4.next = 20;
                                                    break;
                                                }

                                                _context4.next = 14;
                                                return Account.create({ uid: uid });

                                            case 14:
                                                account = _context4.sent;

                                                account.set('displayName', fireuser.name || '路人');
                                                account.set('avatar', 'https://mc-heads.net/avatar/' + account._id + '/100.png');
                                                _context4.next = 19;
                                                return account.save();

                                            case 19:
                                                account = _context4.sent;

                                            case 20:
                                                _context4.next = 22;
                                                return Online.remove({ uid: uid });

                                            case 22:
                                                _context4.next = 24;
                                                return Online.create({
                                                    uid: uid,
                                                    sid: sid,
                                                    account: account,
                                                    location: account.location
                                                });

                                            case 24:
                                                online = _context4.sent;
                                                _context4.next = 27;
                                                return Online.find().populate('account');

                                            case 27:
                                                list = _context4.sent;


                                                list = list.map(function (o) {
                                                    return {
                                                        sid: o.sid,
                                                        location: o.location,
                                                        displayName: o.account.displayName,
                                                        avatar: o.account.avatar
                                                    };
                                                });

                                                //傳送專屬 sid
                                                socket.emit('welcome', { sid: sid, list: list });

                                                //廣播登入
                                                io.emit('join', {
                                                    sid: sid,
                                                    displayName: account.displayName,
                                                    avatar: account.avatar,
                                                    location: online.location
                                                });

                                                //更新資料
                                                socket.on('update', function () {
                                                    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
                                                        var count;
                                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                                            while (1) {
                                                                switch (_context.prev = _context.next) {
                                                                    case 0:
                                                                        if (data.location) {
                                                                            online.set('location', data.location);
                                                                        }

                                                                        if (data.avatar) {
                                                                            account.set('avatar', data.avatar);
                                                                        }

                                                                        if (data.displayName) {
                                                                            account.set('displayName', data.displayName);
                                                                        }

                                                                        _context.prev = 3;
                                                                        _context.next = 6;
                                                                        return account.save();

                                                                    case 6:
                                                                        account = _context.sent;
                                                                        _context.next = 9;
                                                                        return online.save();

                                                                    case 9:
                                                                        online = _context.sent;
                                                                        _context.next = 12;
                                                                        return Online.count();

                                                                    case 12:
                                                                        count = _context.sent;


                                                                        io.emit('update', {
                                                                            sid: sid,
                                                                            displayName: account.displayName,
                                                                            avatar: account.avatar,
                                                                            location: online.location
                                                                        }, { count: count });
                                                                        _context.next = 19;
                                                                        break;

                                                                    case 16:
                                                                        _context.prev = 16;
                                                                        _context.t0 = _context['catch'](3);

                                                                        console.log('(update)', _context.t0);

                                                                    case 19:
                                                                    case 'end':
                                                                        return _context.stop();
                                                                }
                                                            }
                                                        }, _callee, _this, [[3, 16]]);
                                                    }));

                                                    return function (_x2) {
                                                        return _ref2.apply(this, arguments);
                                                    };
                                                }());

                                                //取回線上清單
                                                socket.on('refresh', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                                                    var list;
                                                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                        while (1) {
                                                            switch (_context2.prev = _context2.next) {
                                                                case 0:
                                                                    _context2.next = 2;
                                                                    return Online.find().populate('account');

                                                                case 2:
                                                                    list = _context2.sent;


                                                                    list = list.map(function (o) {
                                                                        return {
                                                                            sid: o.sid,
                                                                            location: o.location,
                                                                            displayName: o.account.displayName,
                                                                            avatar: o.account.avatar
                                                                        };
                                                                    });

                                                                    socket.emit('refresh', { list: list });

                                                                case 5:
                                                                case 'end':
                                                                    return _context2.stop();
                                                            }
                                                        }
                                                    }, _callee2, _this);
                                                })));

                                                //斷線
                                                socket.on('disconnect', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
                                                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                        while (1) {
                                                            switch (_context3.prev = _context3.next) {
                                                                case 0:
                                                                    console.log('disconnect');
                                                                    account.set('location', online.get('location'));

                                                                    _context3.prev = 2;
                                                                    _context3.next = 5;
                                                                    return account.save();

                                                                case 5:
                                                                    _context3.next = 7;
                                                                    return online.remove({ uid: uid });

                                                                case 7:
                                                                    _context3.next = 12;
                                                                    break;

                                                                case 9:
                                                                    _context3.prev = 9;
                                                                    _context3.t0 = _context3['catch'](2);

                                                                    console.log('(disconnect)', _context3.t0);

                                                                case 12:

                                                                    io.emit('leave', { sid: sid });

                                                                case 13:
                                                                case 'end':
                                                                    return _context3.stop();
                                                            }
                                                        }
                                                    }, _callee3, _this, [[2, 9]]);
                                                })));

                                            case 34:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, _this);
                            })(), 't0', 2);

                        case 2:
                            _context5.next = 8;
                            break;

                        case 4:
                            _context5.prev = 4;
                            _context5.t1 = _context5['catch'](0);

                            console.log(_context5.t1);

                            //強制斷線
                            socket.emit('error', { message: _context5.t1.message });

                        case 8:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this, [[0, 4]]);
        }));

        return function connection(_x) {
            return _ref.apply(this, arguments);
        };
    }();

    io.on('connection', connection);
}
//# sourceMappingURL=index.js.map