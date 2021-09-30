const mongoose = require('mongoose');
const db = mongoose.connection;

const model = {
  Answer: require('./models/answer'),
  End: require('./models/end')
};

mongoose.connect(process.env.MONGO_PATH, {
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