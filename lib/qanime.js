const fs = require('fs');

module.exports = () => {
  const data = fs.readFileSync('./lib/animex.json');
  const jsonData = JSON.parse(data);
  const randIndex = Math.floor(Math.random() * jsonData.length);
  const randKey = jsonData[randIndex];
  return `*Author:* ${randKey.by}\n*Quote:* ${randKey.quote}`;
}