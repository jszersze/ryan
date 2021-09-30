module.exports = (app) => {
  app.post('/question', (req, res) => {

    console.log(req.body);

    const reply = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: "mrkdwn",
            text: 'Not now. Making soup... :ryan-eats-soup:'
          }
        }
      ]
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reply));
  });
};