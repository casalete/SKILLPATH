import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	uuid: {
		type: String,
		required: true,
		unique: true
	},
	authData: {
		type : Object
	},
	firstName: {
		type: String,
		required: true,
		maxlength: 100,
	},
	lastName: {
		type: String,
		required: true,
		maxlength: 100,
	},
	username: {
		type: String,
		required: true,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: 1,
	},
	rank: {
		type: {topicName: String, rank: Number}
	},
	followedTopics: [{
		type: String
	}],
	followedUsers: [{
		type: String
	}],
	lastActivity: {
		type: Date
	}
});

userSchema.pre('save', async function (next) {
	const user: any = this;
	const hash = await bcrypt.hash(user.password, 10);

	user.password = hash;
	next();
});

userSchema.methods.isValidPassword = async function (password) {
	const user: any = this;
	const compare = await bcrypt.compare(password, user.password);

	return compare;
};

userSchema.plugin(mongoosastic, {
	host: 'localhost',
	port: 9200,
});

const User = mongoose.model('User', userSchema);

export default User;
