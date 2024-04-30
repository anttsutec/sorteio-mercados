const crypto = require('crypto');
const fs = require('fs');


function createMD5(filePath) {
  const arquivoJson = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5');
  hash.update(arquivoJson);
  return hash.digest('hex');
}

module.exports = { createMD5 };