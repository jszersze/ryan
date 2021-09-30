const mongoose = require('mongoose');
const config = require('./config.json');
const db = mongoose.connection;

const model = {
  Answer: require('./models/answer'),
  End: require('./models/end')
};

mongoose.connect(config.main.mongo_path, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

db.once('open', () => {
  console.log('mongo connection started');
});

db.on('error', () => {
  console.log('connection failed');
});

module.exports = model;