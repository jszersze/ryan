const message = require('../mind/message');
const process = require('../mind/process');

module.exports = function (app) {
  app.post('/question', async (req, res) => {
    const reply = await process.accept(req.body);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(message.reply(reply));
  });

  app.post('/debug', async (req, res) => {
    const reply = await process.accept(req.query);
    const snapshot = process.getSnapshot();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(message.replyDebug(reply, snapshot));
  });

  app.get('/question', async (req, res) => {
    const reply = await process.accept(req.query);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(message.reply(reply));
  });
};