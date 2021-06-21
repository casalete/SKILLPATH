import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';
import bcrypt from 'bcrypt';

export interface Rank {
    topicName: String;
    rank: Number;
}
interface User {
    authData: Object;
    firstName: String;
    lastName: String;
    password: String;
    email: String;
    rank: Rank[];
    score: number;
    followedTopics: String[];
    followedUsers: String[];
    lastActivity: Date;
    about?: String;
    displayName?: String;
    achievements: String[];
    followers?: number;
    imagePath: String;
}

interface UserModel extends User, mongoose.Document {}

const userSchema = new mongoose.Schema({
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
    imagePath: {
        type: String,
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
    about: {
        type: String,
    },
    displayName: {
        type: String,
    },
    rank: [
        {
            type: Object,
        },
    ],
    score: Number,
    followedTopics: [
        {
            type: String,
        },
    ],
    followedUsers: [
        {
            type: String,
        },
    ],
    achievements: [
        {
            type: String,
        },
    ],
    lastActivity: {
        type: Date,
    },
    followers: Number,
});

// userSchema.pre('save', async function (next) {
//     const user: any = this;
//     const hash = await bcrypt.hash(user.password, 10);

//     user.password = hash;
//     next();
// });

userSchema.methods.isValidPassword = async function (password) {
    const user: any = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
};

userSchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200,
});

export const UserModel = mongoose.model<UserModel>('User', userSchema);
