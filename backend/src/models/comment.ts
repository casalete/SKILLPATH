import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

const commentSchema = new mongoose.Schema({
    uuid: {
		type: String,
		required: true,
		unique: true
	},
    author: {
        type: String,
        required: true,
        unique : true
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
    topic: {
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
    votersList: {
        type : [{ userName : String, voteType : { upVote : String, downVote: String, comment : String} }]
    }   
});

commentSchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200,
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
