module.exports = (app) => {
  app.post('/question', (req, res) => {

    console.log(req.body);

    const reply = {
      blocks: [
        {
          type: 'section',
          response_type: "in_channel",
          text: {
            type: "mrkdwn",
            text: ':ryan-eats-soup: Not now. Making soup...'
          }
        }
      ]
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reply));
  });
};