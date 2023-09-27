const crypto = require('crypto');

exports.hashUrl = (url) => {
    const hash = crypto.createHash('md5');
    return hash.update(url).digest('hex');
  }