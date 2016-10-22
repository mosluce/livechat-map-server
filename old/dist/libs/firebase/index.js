'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var firebase = require('firebase');
var path = require('path');

firebase.initializeApp({
    serviceAccount: path.join(__dirname, '../../../serviceAccountCredentials.json'),
    databaseURL: "https://livemap-c4a8d.firebaseio.com/"
});

exports.default = firebase;
//# sourceMappingURL=index.js.map