const config = require('./config.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');

require('dotenv').config();

/**
 * Services
 */
const questions = require('./services/questions');

// app.use(bodyParser.json());
app.use(express.static('public'));

/**
 * Middleware
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Accept-Encoding', 'gzip,deflate');
  next();
});

questions(app);

if (config.https) {

  const cert_options = {
      cert: fs.readFileSync(path.join(app.options.dirname, 'certs/cert.pem')),
      key: fs.readFileSync(path.join(app.options.dirname, 'certs/key.pem'))
    },
    https_server = https.createServer(cert_options, app);

  https_server.listen(config.port_https, () => {
    console.log(`${config.title} worker started on port ${config.port_https} - in https`);
  });
}

app.listen(config.port, () => {
  console.log(`${config.title} worker started on port ${config.port}`);
});
