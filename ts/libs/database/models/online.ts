import mongoose = require('mongoose');

export class Online {
    static init() {
        let schema = new mongoose.Schema({
            sid: String,
            userId: String,
            displayName: String,
            avatar: String,
            connectionType: String,
            location: {
                'type': { type: String, default: "Point" },
                coordinates: [{ type: "Number" }]
            }
        });

        return mongoose.model('Online', schema);
    }
}
