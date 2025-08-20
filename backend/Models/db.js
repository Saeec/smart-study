// backend/Models/db.js

const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB database connection established successfully');
})
.catch(err => {
  console.error('!!! DATABASE CONNECTION FAILED !!!');
  console.error(err);
  process.exit(1);
});

module.exports = mongoose;
