import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';
import { VoteType } from './voteType';

interface Comment {
	author: String,
	postName: String,
    content: String,
    topicName: String,
    upVotes: Number,
    downVotes: Number,
    lastUpdated: Date,
    score: Number,
	votersList: [{
        userName: String,
        voteType: VoteType,
    }]
}

interface CommentModel extends Comment, mongoose.Document {}

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        unique : true
    },
    postId: {
        type: String,
        required: true,
        unique: true,
    },
    postName: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true
    },
    topicName: {
        type : String
    },
    upVotes: {
        type: Number
    },
    downVotes: {
        type: Number
    },
    lastUpdated: {
        type : Date
    },
    score : {
        type : Number
    },
    votersList: [{
        userName: String,
        voteType: String,
    }] 
});

commentSchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200,
});

export const CommentModel = mongoose.model<CommentModel>('Comment', commentSchema);

