const firebase = require('firebase');
const path = require('path');

firebase.initializeApp({
    serviceAccount: path.join(__dirname, '../../../serviceAccountCredentials.json'),
    databaseURL: "https://livemap-c4a8d.firebaseio.com/"
});

export default firebase;