const passport = require('passport')
const express = require('express')
const router = express.Router()
const { generateToken, sendToken } = require('../utils/token.utils')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' })
})

/* GET Google Authentication API. */
// router.get(
// 	'/auth/google',
// 	passport.authenticate('google', {
// 		scope: ['profile', 'email']
// 	})
// )

router.route('/auth/google').post(
	passport.authenticate('google-token', { session: false }),
	function(req, res, next) {
		if (!req.user) {
			return res.send(401, 'User Not Authenticated')
		}
		req.auth = {
			id: req.user.id
		}

		next()
	},
	generateToken,
	sendToken
)

// router.get(
// 	'/auth/google/callback',
// 	passport.authenticate('google', { failureRedirect: '/login' }),
// 	function(req, res) {
// 		console.log(res);
// 		res.redirect('/');
// 		// var token = req.user.token;
// 		// res.redirect('http://localhost:8080?token=' + token);
// 	}
// );

module.exports = router
