import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'

const postSchema = new mongoose.Schema({
   uuid: {
      type: String,
      required: true,
      unique: true
   },
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
   commentList: [{
     id 
   }]
})

postSchema.plugin(mongoosastic, {
   "host": "localhost",
   "port": 9200
});

const Post = mongoose.model('Post', postSchema)
export default Post