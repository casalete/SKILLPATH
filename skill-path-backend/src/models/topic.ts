import mongoose from 'mongoose'
import mongoosastic from 'mongoosastic'

const topicSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true
   }
})

topicSchema.plugin(mongoosastic, {
   "host": "localhost",
   "port": 9200
});

const Topic = mongoose.model('Topic', topicSchema)
export default Topic