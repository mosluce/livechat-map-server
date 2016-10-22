import { ILocation } from './location';
import * as mongoose from 'mongoose';

export interface IAccount extends mongoose.Document {
    uid: string;
    avatar?: string;
    displayName?: string;
    location: ILocation;
}

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

export const Account = mongoose.model('Account', schema);