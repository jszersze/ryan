module.exports = (app) => {
  app.get('/question', (req, res) => {
    res.end('Not now. Making soup...');
  });
};