"use strict";
const mongoose = require('mongoose');
let schema = new mongoose.Schema({
    sid: String,
    uid: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    location: {
        'type': {
            type: String,
            default: "Point"
        },
        coordinates: [{
                type: Number
            }]
    }
});
exports.OnlineUser = mongoose.model('OnlineUser', schema);
//# sourceMappingURL=online-user.js.map