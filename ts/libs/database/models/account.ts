import mongoose = require('mongoose');

export class Account {
    static init() {
        let schema = new mongoose.Schema({
            userId: {
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
                'type': { type: String, default: "Point" },
                coordinates: [{ type: "Number" }]
            }
        });

        return mongoose.model('Account', schema);
    }
}
