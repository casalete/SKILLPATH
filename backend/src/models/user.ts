import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic';
import bcrypt from 'bcrypt';

const salt : number = 10;

const userSchema = new mongoose.Schema({
   /* firstname:{
      type: String,
      required: true,
      maxlength: 100
  },
  lastname:{
      type: String,
      required: true,
      maxlength: 100
  }, */
  email:{
      type: String,
      required: true,
      trim: true,
      unique: 1
  },
  password:{
      type:String,
      required: true,
      minlength:8
  }
})

userSchema.pre(
    'save',
    async function(next) {
      const user : any = this;
      const hash = await bcrypt.hash(user.password, 10);
  
      user.password = hash;
      next();
    }
);

userSchema.methods.isValidPassword = async function(password) {
    const user : any = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

userSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200
});

const User = mongoose.model('User', userSchema);

export default User;