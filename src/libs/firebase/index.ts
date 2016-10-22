import * as firebase from 'firebase';
import * as path from 'path';

firebase.initializeApp({
    serviceAccount: path.join(__dirname, '../../../serviceAccountCredentials.json'),
    databaseURL: "https://livemap-c4a8d.firebaseio.com/"
});

export default firebase;