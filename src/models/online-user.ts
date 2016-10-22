import { IAccount } from './account';
import { ILocation } from './location';
import * as mongoose from 'mongoose';

export interface IOnlineUser extends mongoose.Document {
    sid: string;
    uid: string;
    account: IAccount;
    location: ILocation;
}

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

export const OnlineUser = mongoose.model('OnlineUser', schema);