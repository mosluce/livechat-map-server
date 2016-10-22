import { OnlineUser, IOnlineUser } from './../models/online-user';
import { Account, IAccount } from './../models/account';
import * as socketIO from 'socket.io';
import firebase from '../libs/firebase';

class Connection {
    io: SocketIO.Server;
    socket: SocketIO.Socket;
    onlineUser: IOnlineUser;
    account: IAccount;

    constructor(io: SocketIO.Server) {
        this.io = io;
    }

    handler = async (socket: SocketIO.Socket) => {
        try {
            this.socket = socket;

            console.log(socket.id, 'connect');

            //Get firebaseToken from socket connection header
            let {firebasetoken} = socket.handshake.headers;
            //Get firebase user data
            let fireuser = await firebase.auth().verifyIdToken(firebasetoken);

            let sid = socket.id;
            let uid = fireuser.uid;
            //Get account by uid
            let account = <IAccount>await Account.findOne({ uid });

            if (!account) {
                //host uid in my database
                account = <IAccount>await Account.create({
                    uid,
                    displayName: fireuser.name || 'NoName'
                });
                //auto generate avatar
                account.set('avatar', `https://mc-heads.net/avatar/${account._id}/100.png`);
                account = await account.save();
            }

            this.account = account;

            await OnlineUser.remove({ uid });

            let ouser = <IOnlineUser>await OnlineUser.create({
                uid,
                sid,
                account: account,
                location: account.location
            });
            this.onlineUser = ouser;

            let list = <Array<IOnlineUser>>await OnlineUser.find().populate('account');
            let outList = list.map((o) => {
                return {
                    sid: o.sid,
                    location: o.location,
                    displayName: o.account.displayName,
                    avatar: o.account.avatar
                }
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
        } catch (ex) {
            console.log(ex);
        }
    }

    /**
     * client update it's status
     * 
     * @param {any} data
     * 
     * @memberOf Socket
     */
    onSocketUpdate = async (data) => {
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
            this.account = await this.account.save();
            this.onlineUser = await this.onlineUser.save();

            let count = await OnlineUser.find().count();

            this.io.emit('update', {
                sid: this.socket.id,
                displayName: this.account.displayName,
                avatar: this.account.avatar,
                location: this.onlineUser.location
            }, { count });

        } catch (ex) {
            console.log('(update)', ex);
        }
    }

    /**
     * client request new online users list
     * 
     * @param {any} data
     * 
     * @memberOf Socket
     */
    onSocketRefresh = async (data) => {
        console.log(this.socket.id, 'refresh');

        try {
            let list = <Array<IOnlineUser>>await OnlineUser.find().populate('account');
            let outList = list.map((o) => {
                return {
                    sid: o.sid,
                    location: o.location,
                    displayName: o.account.displayName,
                    avatar: o.account.avatar
                }
            });

            this.socket.emit('refresh', { list: outList });
        } catch (ex) {
            console.log('(refresh)', ex);
        }
    }

    /**
     * client disconnection
     * 
     * @param {any} data
     * 
     * @memberOf Socket
     */
    onSocketDisconnection = async (data) => {
        console.log(this.socket.id, 'disconnect');

        if (this.onlineUser.location) {
            this.account.set('location', Object.assign({}, this.onlineUser.location, { type: "Point" }));
        }

        let sid = this.onlineUser.sid;

        try {
            await this.account.save();
            await OnlineUser.remove({ uid: this.account.uid });
        } catch (ex) {
            console.log(ex);
        }

        this.io.emit('leave', { sid });
    }

    onlineUserList = async () => {
        let list = <Array<IOnlineUser>>await OnlineUser.find().populate('account');
        return list.map((o) => {
            return {
                sid: o.sid,
                location: o.location,
                displayName: o.account.displayName,
                avatar: o.account.avatar
            }
        });
    }
}

export class Socket {
    io: SocketIO.Server;
    socket: SocketIO.Socket;

    constructor(serv: any) {
        this.io = socketIO(serv);
        this.io.on('connection', (socket) => new Connection(this.io).handler(socket));
    }
}