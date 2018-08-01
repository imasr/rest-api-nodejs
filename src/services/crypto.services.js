import cryptojs from "crypto-js";
// import config from '../config.json';
import './../config/config';


// Encrypt
let encryptFunc = (data) => {
    return new Promise((Resolve, Reject) => {
        let temp = cryptojs.AES.encrypt(data.toString(), process.env.secret_token);
        return Resolve(temp.toString());
    })
}

// Decrypt
let decryptFunc = (encryptedData) => {
    return new Promise((Resolve, Reject) => {
        let bytes = cryptojs.AES.decrypt(encryptedData.toString(), process.env.secret_token);
        let plaintext = bytes.toString(cryptojs.enc.Utf8);
        return Resolve(plaintext);
    })
}

module.exports = {
    encryptFunc,
    decryptFunc
}