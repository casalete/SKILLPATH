import mongoose, { Mongoose } from 'mongoose';

mongoose.connect('mongodb://localhost:27017/test').
  catch(error => console.log(error));