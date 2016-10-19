import express = require('express');
import mongoose = require('mongoose');
import sinch = require('../libs/sinch');

let router = express.Router();

router.get('/', (req, res) => {
    res.send('welcome');
});

router.post('/signup', async (req, res) => {
    let Account = mongoose.model('Account');
    let { userId, displayName } = req.body;

    let acc = await Account.findOne({ userId });

    if (!acc) acc = await Account.create({ userId, displayName });

    res.send({
        userId,
        displayName
    });
});

router.post('/sinch/signature', async (req, res) => {
    let Account = mongoose.model('Account');
    let { userId } = req.body;

    let account: any = await Account.findOne({ userId });

    if (!account) {
        let count = await Account.count({});

        if (count >= 1000) {
            res.status(400);

            return res.send({
                message: 'Amount of Beta Users is full'
            });
        }

        account = await Account.create({
            userId
        });
    }

    let sequence = account.sequence + 1;

    account.set('sequence', sequence);
    await account.save();

    let signature = sinch.signature(userId, sequence);

    res.send({
        signature,
        sequence
    });
});

export default router;

