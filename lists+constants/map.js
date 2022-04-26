const fs = require('fs');
const map = JSON.parse(fs.readFileSync('./lists+constants/fullMap.json', 'utf8'));

module.exports = map;