const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/node-react-starter`, {useNewUrlParser:true, useCreateIndex:true});

const connection = mongoose.connection;
connection.once('open',() =>{console.log("MongoDB database connection established succesfully")})

app.use(cors());
app.use(bodyParser.json());

const usersRouter = require('./routes/users');
const concertsRouter = require(./routes/concerts');

app.use('/users', usersRouter);
app.use('./concerts', concertsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});