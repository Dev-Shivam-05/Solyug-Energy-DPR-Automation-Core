import mongoose from 'mongoose';
import envConfig from './envConfig.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(envConfig.MONGODB_URL);
    console.log('Database connected');
  } catch (error) {
    console.log(error.message);
  }
};

export default dbConnect();