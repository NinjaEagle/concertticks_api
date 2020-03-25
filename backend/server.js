const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
const https = require('https')
const http = require('http')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
// auth
const path = require('path')
const User = require('./models/user.model')
const session = require('express-session')
const passport = require('passport')
const app = express()

var corsOption = {
	origin: true,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true,
	exposedHeaders: ['x-auth-token']
}
app.use(cors(corsOption))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// const graphqlHTTP = require('express-graphql');
// const schema = require('schema');
// const {buildSchema} = require('graphql');

require('dotenv').config()
// If we are in production we are already running in https
// if (process.env.NODE_ENV === 'production') {
// 	server = http.createServer(app);
// }
// // We are not in production so load up our certificates to be able to
// // run the server in https mode locally
// else {
// 	// const certOptions = {
// 	// 	key: fs.readFileSync(path.resolve('certs/server.key')),
// 	// 	cert: fs.readFileSync(path.resolve('certs/server.crt'))
// 	// };
// 	// server = https.createServer(certOptions, app);
// 	server = https.createServer(app);
// }

// setup passport and accept JSON objects also allow requests from our client
// app.use(cors({ origin: CLIENT_ORIGIN }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())

// set up URI
const uri = process.env.ATLAS_URI
// mongoose.Promise = global.Promise;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
// .then(() => console.log('Connected')).
// catch(err => console.log('Caught', err.stack));

const connection = mongoose.connection
connection.once('open', () => {
	console.log('MongoDB database connection established successfully')
})
connection.on('error', error =>
	console.log('Error connecting to MongoLab:', error)
)

// Use api routes in the app
const usersRouter = require('./routes/users')
const concertsRouter = require('./routes/concerts')
const authRoutes = require('./routes/auth.router.js')

require('./routes/passport')
app.use('/users', usersRouter)
app.use('/concerts', concertsRouter)

// direct all requests to the auth router
app.use('/api/v1/', authRoutes)
// app.use(function(req, res, next) {
// 	next(createError(404))
// })

// session will not save unless something is changed
// saveUninitialized: true allows us to attach the socket id to the session
// before we have athenticated the user
app.use(
	session({
		secret: 'keyboard cat',
		// secret: process.env.SESSION_SECRET,
		resave: true,
		saveUnitialized: true
	})
)

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`)
})

// // Connecting sockets to the server and adding them to the request
// // so that we can access them later in the controller
// const io = socketio.listen(server);

// io.on('connection', function(socket) {
// 	console.log('a user connected');
// });
// app.use(express.static('public'));
// app.set('io', io);

// app.use(function(err, req, res, next) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message
// 	res.locals.error = req.app.get('env') === 'development' ? err : {}

// 	// render the error page
// 	res.status(err.status || 500)
// 	res.render('error')
// })
