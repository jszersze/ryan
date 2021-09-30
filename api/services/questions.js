module.exports = (app) => {
  app.post('/question', (req, res) => {

    console.log(req.body);

    const reply = {
      response_type: 'in_channel',
      text: 'Not now. Making soup...'
    }

    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(JSON.stringify(reply));
  });
};