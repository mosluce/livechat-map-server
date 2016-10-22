"use strict";
const mongoose = require('mongoose');
let schema = new mongoose.Schema({
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
exports.Account = mongoose.model('Account', schema);
//# sourceMappingURL=account.js.map