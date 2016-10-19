import mongoose = require('mongoose');
import { Account } from './models/account';
import { Online } from './models/online';

mongoose.Promise = Promise;

export function init(): Promise<mongoose.Connection> {
    return new Promise((resolve, reject) => {
        let url = process.env.MONGODB_URI || 'mongodb://localhost/mos-livemap';
        let conn = mongoose.connection;

        conn.once('open', () => {
            console.log('Mongoose default connection open to ' + url);

            Account.init();
            Online.init();

            resolve(conn);
        })

        conn.on('error', (error) => reject(error));

        // When the connection is disconnected
        conn.on('disconnected', () => {
            console.log('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            conn.close(() => {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });

        mongoose.connect(url);
    });
}