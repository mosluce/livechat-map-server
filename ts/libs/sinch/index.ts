import crypto = require('crypto');

const appKey = "0471d537-61c2-4bb0-9177-74402eda18ac";
const appSecret = "ndQnaw5B1U6XrXY7C3E7EA==";

export function signature(userId: String, sequence: number): String {
    let stringToSign = `${userId}${appKey}${sequence}${appSecret}`;
    let sha1 = crypto.createHash('sha1');

    sha1.update(stringToSign);

    return sha1.digest('base64');
}

export function validate(signature: String, sequence: number, userId: String) {
    let stringToSign = `${userId}${appKey}${sequence}${appSecret}`;
    let sha1 = crypto.createHash('sha1');

    sha1.update(stringToSign);

    return sha1.digest('base64') === signature
}