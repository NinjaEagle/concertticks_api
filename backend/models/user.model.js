const mongoose = require('mongoose');

const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const userSchema = new Schema(
	{ email: { type: String, index: String } },
	{ googleId: { type: String } },
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3
		}
	},
	{ password: { type: String } },
	{ accessToken: { type: String } },
	{ userId: { type: ObjectId, ref: 'User' } },
	{ dateAdded: { type: Date, default: Date.now } },
	{
		timestamps: true
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.getUserByEmail = function(email, callback) {
	var query = { email: email };
	User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
};
