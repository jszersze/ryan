const message = require('../mind/message');
const process = require('../mind/process');

module.exports = function (app) {
  app.post('/question', (req, res) => {

    const reply = process.message(req.query);

    console.log('1', req.params);
    console.log('2', req.body);
    console.log('3', req.query);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(message.reply(reply));
  });
};