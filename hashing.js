const crypto = require('crypto');
const text ="hardik.57v"+"57ok";
const hash = crypto.createHash('sha256').update(text).digest('hex');
console.log(hash);