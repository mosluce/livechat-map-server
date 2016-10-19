import firebase from '../libs/firebase';

const { Router } = require('express');
const { connection } = require('mongoose');

const router = Router();

router.get('/', (req, res) => {
    res.send('welcome');
});

/**
router.post('/signature', async (req, res) => {
    try {
        const Account = connection.model('Account');

        let {uid, displayName} = req.body
        let acc = await Account.findOne({ uid });

        if (!acc) {
            acc = await Account.create({ uid });
            acc.set('displayName', displayName || '路人');
            acc.set('avatar', `https://mc-heads.net/avatar/${acc._id}/100.png`);
            acc = await acc.save();
        }

        let token = firebase.auth().createCustomToken(uid);

        res.send({
            token: token
        });
    } catch (ex) {
        console.log('exception', ex.message);
        res.status(500)
        res.send({
            message: 'Internal Server Error'
        });
    }
});
 */

module.exports = router;