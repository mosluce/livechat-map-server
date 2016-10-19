import mongoose = require('mongoose');

export const handler = (io: SocketIO.Server) => {
    return async (socket) => {
        let Online = mongoose.model('Online');
        let Account = mongoose.model('Account');

        let sid = socket.id;
        let {userId, displayName} = socket.handshake.query;

        //簡易驗證使用者ID
        let acc = await Account.findOne({ userId });

        if (!acc) {
            console.log('kick:', userId);
            socket.emit('kick');
            socket.disconnect(true);
            return
        }

        console.log('verified:', acc.get('userId'));

        //更新資料
        if (displayName) {
            acc.set('displayName', displayName);
        }

        if (!acc.get('avatar')) {
            let avatar = `https://mc-heads.net/avatar/${acc._id.toString()}/100.png`;
            acc.set('avatar', avatar);
        }

        acc = await acc.save();

        //線上名單更新
        await Online.remove({ userId });
        let online: any = await Online.create({
            userId,
            sid,
            avatar: acc.get('avatar'),
            displayName: acc.get('displayName'),
            location: acc.get('location')
        });

        //取得線上清單
        let onlines = await Online.find();
        let list = onlines.map((o: any) => {
            let {sid, displayName, avatar, location} = o;
            return { sid, displayName, avatar, location };
        });

        console.log('welcome:', userId);
        socket.emit('welcome', { list, sid });

        //建立監聽
        socket.on('join', async () => {
            let {sid, displayName, avatar, location} = online;
            io.emit('join', { sid, displayName, avatar, location });
        });

        socket.on('update', async (data) => {
            if (data.location) online.set('location', data.location);
            if (data.displayName) online.set('displayName', data.displayName);
            if (data.avatar) online.set('avatar', data.avatar);

            online = await online.save();

            let {sid, displayName, avatar, location} = online;

            console.log('update sid:', online.sid);

            io.emit('update', { sid, displayName, avatar, location });
        });

        socket.on('disconnect', async () => {
            console.log('leave:', userId);

            await Online.findByIdAndRemove(online._id);

            io.emit('leave', { sid });
        });
    }
}