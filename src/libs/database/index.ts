import mongoose = require('mongoose');

mongoose.Promise = Promise;

/**
 * 初始化 mongoose
 * @export
 * @returns Promise<mongoose.Connection>
 */
export function init() {
    return new Promise((resolve, reject) => {
        let url = process.env.MONGODB_URI || 'mongodb://localhost/mos-livemap';
        let conn = mongoose.connection;

        conn.once('open', () => {
            console.log('Mongoose default connection open to ' + url);

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