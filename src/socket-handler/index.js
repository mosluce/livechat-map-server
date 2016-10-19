import firebase from '../libs/firebase';

const mongoose = require('mongoose');

/**
 * @param {SocketIO.Server} io
 */
export function handler(io) {
    io.on('connection', connection);

    /**
     * @param {SocketIO.Socket} socket
     */
    async function connection(socket) {
        try {
            let Account = mongoose.connection.model('Account');
            let Online = mongoose.connection.model('Online');

            let {firebasetoken} = socket.handshake.headers;

            let fireuser = await firebase.auth().verifyIdToken(firebasetoken);
            let sid = socket.id;
            let uid = fireuser.uid;

            let account = await Account.findOne({ uid })

            if (!account) {
                account = await Account.create({ uid })
                account.set('displayName', fireuser.name || '路人');
                account.set('avatar', `https://mc-heads.net/avatar/${account._id}/100.png`);
                account = await account.save();
            }

            await Online.remove({ uid });

            let online = await Online.create({
                uid,
                sid,
                account: account,
                location: account.location
            });

            let list = await Online.find().populate('account');

            list = list.map((o) => {
                return {
                    sid: o.sid,
                    location: o.location,
                    displayName: o.account.displayName,
                    avatar: o.account.avatar
                }
            });

            //傳送專屬 sid
            socket.emit('welcome', { sid, list: list });

            //廣播登入
            io.emit('join', {
                sid,
                displayName: account.displayName,
                avatar: account.avatar,
                location: online.location
            });

            //更新資料
            socket.on('update', async (data) => {
                if (data.location) {
                    online.set('location', data.location);
                }

                if (data.avatar) {
                    account.set('avatar', data.avatar);
                }

                if (data.displayName) {
                    account.set('displayName', data.displayName);
                }

                try {
                    account = await account.save();
                    online = await online.save();

                    let count = await Online.count();

                    io.emit('update', {
                        sid,
                        displayName: account.displayName,
                        avatar: account.avatar,
                        location: online.location
                    }, { count });
                } catch (e) {
                    console.log('(update)', e);
                }
            });

            //取回線上清單
            socket.on('refresh', async () => {
                let list = await Online.find().populate('account');

                list = list.map((o) => {
                    return {
                        sid: o.sid,
                        location: o.location,
                        displayName: o.account.displayName,
                        avatar: o.account.avatar
                    }
                });

                socket.emit('refresh', { list });
            });

            //斷線
            socket.on('disconnect', async () => {
                console.log('disconnect');
                account.set('location', online.get('location'));

                try {
                    await account.save();
                    await online.remove({ uid });
                } catch (ex) {
                    console.log('(disconnect)', ex);
                }

                io.emit('leave', { sid });
            });
        } catch (ex) {
            console.log(ex);

            //強制斷線
            socket.emit('error', { message: ex.message });
        }

    }
}