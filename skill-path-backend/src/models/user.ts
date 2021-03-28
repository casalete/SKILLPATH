import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
})

userSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200
});

const User = mongoose.model('User', userSchema);

export default User;