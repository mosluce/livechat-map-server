const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export class Account {
    static init() {
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
            sequence: {
                type: Number,
                required: true,
                default: 0
            },
            location: {
                'type': {
                    type: String,
                    default: "Point"
                },
                coordinates: [{
                    type: "Number"
                }]
            }
        });

        return mongoose.model('Account', schema);
    }
}
export class Online {
    static init() {
        let schema = new mongoose.Schema({
            sid: String,
            uid: String,
            account: {
                type: Schema.Types.ObjectId,
                ref: 'Account'
            },
            location: {
                'type': {
                    type: String,
                    default: "Point"
                },
                coordinates: [{
                    type: "Number"
                }]
            }
        });

        return mongoose.model('Online', schema);
    }
}