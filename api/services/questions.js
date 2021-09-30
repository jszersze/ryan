module.exports = (app) => {
  app.post('/question', (req, res) => {

    console.log(req.body);

    const reply = {
      blocks: [
        {
          type: 'section',
          text: {
            type: "mrkdwn",
            text: ':ryan-eats-soup: Not now. Making soup...'
          }
        }
      ]
    }

    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(JSON.stringify(reply));
  });
};