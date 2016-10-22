"use strict";
const firebase = require('firebase');
const path = require('path');
firebase.initializeApp({
    serviceAccount: path.join(__dirname, '../../../serviceAccountCredentials.json'),
    databaseURL: "https://livemap-c4a8d.firebaseio.com/"
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = firebase;
//# sourceMappingURL=index.js.map