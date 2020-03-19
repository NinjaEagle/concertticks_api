const passport = require('passport');
const express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/* GET Google Authentication API. */
router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile']
	})
);
router.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function(req, res) {
		console.log(res);
		res.redirect('/');
		// var token = req.user.token;
		// res.redirect('http://localhost:8080?token=' + token);
	}
);

module.exports = router;
