import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'

const postSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true
   }
})

postSchema.plugin(mongoosastic, {
   "host": "localhost",
   "port": 9200
});

const Post = mongoose.model('Post', postSchema)
export default Post