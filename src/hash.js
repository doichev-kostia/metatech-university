'use strict';

const crypto = require('node:crypto');
const { saltLength, passwordKeyLength} = require("./config.js")

function hash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(saltLength).toString("base64");
    crypto.scrypt(password, salt, passwordKeyLength, (err, result) => {
      if (err) reject(err);
      resolve(salt + ":" + result.toString("base64"));
    });
  });
}

module.exports = hash;
