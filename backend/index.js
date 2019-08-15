const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-wgttx.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true})
.then(() => {
  const port = 3001;
  app.listen(port, () => console.log(`Start server at http://localhost:${port}`));
})
.catch(err => console.log(err));