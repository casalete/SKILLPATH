import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

interface Topic {
	name: String,
	postsCount: Number,
	suggestedTopics: String[],
}

interface TopicModel extends Topic, mongoose.Document {}


const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    postsCount: {
        type: Number
    },
    suggestedTopics: [{
        type : String
    }]
});

topicSchema.plugin(mongoosastic, {
    host: 'localhost',
    port: 9200,
});

export const TopicModel = mongoose.model<TopicModel>('Topic', topicSchema);

