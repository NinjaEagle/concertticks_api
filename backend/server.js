// const graphqlHTTP = require('express-graphql');
const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cors = require('cors');
// const schema = require('schema');
// const {buildSchema} = require('graphql');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// set up URI
const uri = process.env.ATLAS_URI;
mongoose.Promise = global.Promise;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).then(() => console.log('Connected')).
catch(err => console.log('Caught', err.stack));

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});
connection.on('error', error => console.log('Error connecting to MongoLab:', error));


// allow cross origin requests
// app.use('/graphql', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,  Authorization, Content-Length, X-Requested-With');
//   if (req.method === 'OPTIONS') {
//       res.sendStatus(200);
//   } else {
//       next();
//   }
// });

// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true
// }));

// Use api routes in the app
const usersRouter = require('./routes/users');
const concertsRouter = require('./routes/concerts');

app.use('./users', usersRouter);
app.use('./concerts', concertsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});