var passport = require('passport')
var GoogleStrategy = require('passport-google-token').Strategy
let User = require('../models/user.model')

passport.serializeUser(function(user, done) {
	done(null, user)
})
passport.deserializeUser(function(user, done) {
	done(null, user)
})

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_KEY,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: 'http://localhost:8080/auth/google/callback'
		},
		function(accessToken, refreshToken, profile, done) {
			User.upsertGoogleUser(accessToken, refreshToken, profile, function(
				err,
				user
			) {
				return done(err, user)
			})
		}
	)
)
