import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'
import { VoteType } from './voteType';


interface Post {
	name: String,
   description: String,
   mainTopic: String,
   author: String,
   upVotes: Number,
   downVotes: Number,
   postTopics:  Array<String>,
   creationTimestamp: Date,
   lastVoted: Date,
   commentList:  Array<String>,
   votersList: [{
     userName: String,
     voteType: VoteType,
   }]
}

interface PostModel extends Post, mongoose.Document {}

const postSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   description: {
      type: String,
      required: true
   },
   mainTopic: {
      type: String,
      required: true
   },
   author: {
      type: String,
      required: true,
      unique : true
   },
   upVotes: {
      type: Number
   },
   downVotes: {
      type: Number
   },
   postTopics: {
      type: Array<String>(),
      required: true
   },
   creationTimestamp: {
      type: Date
   },
   lastVoted: {
      type: Date
   },
   commentList: Array<String>(),
   votersList: [{
      userName: String,
      voteType: VoteType,
    }]
})

postSchema.plugin(mongoosastic, {
   "host": "localhost",
   "port": 9200
});

export const Post = mongoose.model<PostModel>('Post', postSchema);
