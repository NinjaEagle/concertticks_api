const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
// auth
const path = require('path');
const errorController = require('./controllers/error');
const User = require('./models/user.model');

const session = require('express-session');
const passport = require('passport');
const socketio = require('socket.io');
const passportInit = require('./routes/passport.init');
const { SESSION_SECRET, CLIENT_ORIGIN } = require('./config');
// const graphqlHTTP = require('express-graphql');
// const schema = require('schema');
// const {buildSchema} = require('graphql');

require('dotenv').config();

const certOptions = {
	key: fs.readFileSync(path.resolve('certs/server.key')),
	cert: fs.readFileSync(path.resolve('certs/server.crt'))
};

const server = https.createServer(certOptions, app);

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use(passport.initialize());
passportInit();

// const addUser = async (req, res, next) => {
// 	const token = req.headers['x-token'];
// 	if (token) {
// 		try {
// 			const { user } = jwt.verify(token, SECRET);
// 			req.user = user;
// 		} catch (err) {
// 			const refreshToken = req.headers['x-refresh-token'];
// 			const newTokens = await refreshTokens(
// 				token,
// 				refreshToken,
// 				models,
// 				SECRET,
// 				SECRET2
// 			);
// 			if (newTokens.token && newTokens.refreshToken) {
// 				res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
// 				res.set('x-token', newTokens.token);
// 				res.set('x-refresh-token', newTokens.refreshToken);
// 			}
// 			req.user = newTokens.user;
// 		}
// 	}
// 	next();
// };

// set up URI
const uri = process.env.ATLAS_URI;
// mongoose.Promise = global.Promise;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
// .then(() => console.log('Connected')).
// catch(err => console.log('Caught', err.stack));

const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});
connection.on('error', error =>
	console.log('Error connecting to MongoLab:', error)
);

// Use api routes in the app
const usersRouter = require('./routes/users');
const concertsRouter = require('./routes/concerts');
const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');

app.use('/users', usersRouter);
app.use('/concerts', concertsRouter);
// app.use('/admin', adminRoutes);
// direct all requests to the auth router
app.use('/', authRoutes);
app.use(errorController.get404);

// session will not save unless something is changed
// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
app.use(
	session({
		secret: process.env.CLIENT_SECRET,
		resave: true,
		saveUnitialized: true
	})
);
// Connecting sockets to the server and adding them to the request
// so that we can access them later in the controller
const io = socketio(server);
app.set('io', io);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`);
});
