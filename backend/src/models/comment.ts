import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';
import { VoteType } from './voteType';

interface Comment {
    author: String;
    authorDisplayName: String;
    authorImage: String;
    postId: String;
    content: String;
    topicName: String;
    voteType?: VoteType;
    upVotes: Number;
    downVotes: Number;
    lastUpdated: Date;
    score: Number;
    votersList: [
        {
            email: String;
            voteType: VoteType;
        },
    ];
}

interface CommentModel extends Comment, mongoose.Document {}

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    authorDisplayName: {
        type: String,
        required: true,
    },
    authorImage: {
        type: String,
    },
    voteType: {
        type: String,
    },
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    topicName: {
        type: String,
    },
    upVotes: {
        type: Number,
    },
    downVotes: {
        type: Number,
    },
    lastUpdated: {
        type: Date,
    },
    score: {
        type: Number,
    },
    votersList: [
        {
            email: String,
            voteType: String,
        },
    ],
});

commentSchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200,
});

export const CommentModel = mongoose.model<CommentModel>('Comment', commentSchema);
