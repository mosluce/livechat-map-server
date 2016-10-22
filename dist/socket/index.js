"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const online_user_1 = require('./../models/online-user');
const account_1 = require('./../models/account');
const socketIO = require('socket.io');
const firebase_1 = require('../libs/firebase');
class Connection {
    constructor(io) {
        this.handler = (socket) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.socket = socket;
                console.log(socket.id, 'connect');
                //Get firebaseToken from socket connection header
                let { firebasetoken } = socket.handshake.headers;
                //Get firebase user data
                let fireuser = yield firebase_1.default.auth().verifyIdToken(firebasetoken);
                let sid = socket.id;
                let uid = fireuser.uid;
                //Get account by uid
                let account = yield account_1.Account.findOne({ uid });
                if (!account) {
                    //host uid in my database
                    account = yield account_1.Account.create({
                        uid,
                        displayName: fireuser.name || 'NoName'
                    });
                    //auto generate avatar
                    account.set('avatar', `https://mc-heads.net/avatar/${account._id}/100.png`);
                    account = yield account.save();
                }
                this.account = account;
                yield online_user_1.OnlineUser.remove({ uid });
                let ouser = yield online_user_1.OnlineUser.create({
                    uid,
                    sid,
                    account: account,
                    location: account.location
                });
                this.onlineUser = ouser;
                let list = yield online_user_1.OnlineUser.find().populate('account');
                let outList = list.map((o) => {
                    return {
                        sid: o.sid,
                        location: o.location,
                        displayName: o.account.displayName,
                        avatar: o.account.avatar
                    };
                });
                //send online user list and him/her self sid 
                this.socket.emit('welcome', { sid, list: outList });
                //broadcast 
                this.io.emit('join', {
                    sid,
                    displayName: account.displayName,
                    avatar: account.avatar,
                    location: ouser.location
                });
                this.socket.on('update', this.onSocketUpdate);
                this.socket.on('refresh', this.onSocketRefresh);
                this.socket.on('disconnect', this.onSocketDisconnection);
            }
            catch (ex) {
                console.log(ex);
            }
        });
        /**
         * client update it's status
         *
         * @param {any} data
         *
         * @memberOf Socket
         */
        this.onSocketUpdate = (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(this.socket.id, 'update');
            if (data.location) {
                this.onlineUser.set('location', Object.assign({}, data.location, { type: "Point" }));
            }
            if (data.displayName) {
                this.account.set('displayName', data.displayName);
            }
            if (data.avatar) {
                this.account.set('avatar', data.avatar);
            }
            try {
                this.account = yield this.account.save();
                this.onlineUser = yield this.onlineUser.save();
                let count = yield online_user_1.OnlineUser.find().count();
                this.io.emit('update', {
                    sid: this.socket.id,
                    displayName: this.account.displayName,
                    avatar: this.account.avatar,
                    location: this.onlineUser.location
                }, { count });
            }
            catch (ex) {
                console.log('(update)', ex);
            }
        });
        /**
         * client request new online users list
         *
         * @param {any} data
         *
         * @memberOf Socket
         */
        this.onSocketRefresh = (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(this.socket.id, 'refresh');
            try {
                let list = yield online_user_1.OnlineUser.find().populate('account');
                let outList = list.map((o) => {
                    return {
                        sid: o.sid,
                        location: o.location,
                        displayName: o.account.displayName,
                        avatar: o.account.avatar
                    };
                });
                this.socket.emit('refresh', { list: outList });
            }
            catch (ex) {
                console.log('(refresh)', ex);
            }
        });
        /**
         * client disconnection
         *
         * @param {any} data
         *
         * @memberOf Socket
         */
        this.onSocketDisconnection = (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(this.socket.id, 'disconnect');
            if (this.onlineUser.location) {
                this.account.set('location', Object.assign({}, this.onlineUser.location, { type: "Point" }));
            }
            let sid = this.onlineUser.sid;
            try {
                yield this.account.save();
                yield online_user_1.OnlineUser.remove({ uid: this.account.uid });
            }
            catch (ex) {
                console.log(ex);
            }
            this.io.emit('leave', { sid });
        });
        this.onlineUserList = () => __awaiter(this, void 0, void 0, function* () {
            let list = yield online_user_1.OnlineUser.find().populate('account');
            return list.map((o) => {
                return {
                    sid: o.sid,
                    location: o.location,
                    displayName: o.account.displayName,
                    avatar: o.account.avatar
                };
            });
        });
        this.io = io;
    }
}
class Socket {
    constructor(serv) {
        this.io = socketIO(serv);
        this.io.on('connection', (socket) => new Connection(this.io).handler(socket));
    }
}
exports.Socket = Socket;
//# sourceMappingURL=index.js.map