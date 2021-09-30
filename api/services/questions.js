const message = require('../mind/message');
const process = require('../mind/process');

module.exports = (app) => {
  app.post('/question', (req, res) => {

    console.log('1', req.params);
    console.log('2', req.query);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(message.reply('Not now. Making soup... :ryan-eats-soup:'));
  });
};