const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressGraphql = require('express-graphql');

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/rootResolver');

const cors = require('./middleware/cors');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

// only for development needs
app.use(cors);
app.use(isAuth);

app.use('/graphql', expressGraphql({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

const { MONGO_USER, MONGO_PASSWORD, MONGO_DB } = process.env;

mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-wgttx.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true})
.then(() => {
  const port = 3001;
  app.listen(port, () => console.log(`Start server at http://localhost:${port}`));
})
.catch(err => console.log(err));