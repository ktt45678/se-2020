const config = require('../modules/config.json');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const connectionString = process.env.DATABASE_URL || config.database_url;
mongoose.connect(connectionString);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

module.exports = db;