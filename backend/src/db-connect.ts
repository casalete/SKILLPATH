import mongoose, { Connection } from 'mongoose'

export default function connectToDatabase() {
  
     mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }).catch((err: any) => console.log(err.reason))
  
     const db: Connection = mongoose.connection;
  
     db.on('error', console.error.bind(console, 'Connection error:'));
     db.once('open', () => { console.log("Connected to MongoDB") });
  }