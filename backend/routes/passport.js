var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
let User = require('../models/user.model');

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(usesr, done) {
	done(null, user);
});
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_KEY,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: 'http://localhost:8080/auth/google/callback'
		},
		function(accessToken, refreshToken, profile, cb) {
			User.findOne({ googleId: profile.id }, function(err, user) {
				return cb(err, user);
			});
			// var userData = {
			// 	email: profile.emails[0].value,
			// 	name: profile.displayName,
			// 	token: accessToken
			// };
			// return done(null, userData);
		}
	)
);
