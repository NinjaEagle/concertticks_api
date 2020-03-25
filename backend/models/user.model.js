const mongoose = require('mongoose')

const Schema = mongoose.Schema
// ObjectId = Schema.ObjectId

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		}
	},
	{ googleProvider: { type: { id: String, token: String }, select: false } },
	// {
	// 	name: {
	// 		type: String,
	// 		required: true,
	// 		unique: true,
	// 		trim: true,
	// 		minlength: 3
	// 	}
	// },
	// { password: { type: String } },
	// { accessToken: { type: String } },
	// { userId: { type: ObjectId, ref: 'User' } },
	// { dateAdded: { type: Date, default: Date.now } },
	{
		timestamps: true
	}
)
userSchema.set('toJSON', { getters: true, virtuals: true })

userSchema.statics.upsertGoogleUser = function(
	accessToken,
	refreshToken,
	profile,
	cb
) {
	var that = this
	return this.findOne(
		{
			'googleProvider.id': profile.id
		},
		function(err, user) {
			// no user was found, lets create a new one
			if (!user) {
				var newUser = new that({
					fullName: profile.displayName,
					email: profile.emails[0].value,
					googleProvider: {
						id: profile.id,
						token: accessToken
					}
				})

				newUser.save(function(error, savedUser) {
					if (error) {
						console.log(error)
					}
					return cb(error, savedUser)
				})
			} else {
				return cb(err, user)
			}
		}
	)
}

const User = mongoose.model('User', userSchema)

module.exports = User

// module.exports.createUser = function(newUser, callback) {
// 	bcrypt.genSalt(10, function(err, salt) {
// 		bcrypt.hash(newUser.password, salt, function(err, hash) {
// 			newUser.password = hash
// 			newUser.save(callback)
// 		})
// 	})
// }

// module.exports.getUserByEmail = function(email, callback) {
// 	var query = { email: email }
// 	User.findOne(query, callback)
// }

// module.exports.getUserById = function(id, callback) {
// 	User.findById(id, callback)
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback) {
// 	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
// 		if (err) throw err
// 		callback(null, isMatch)
// 	})
// }
