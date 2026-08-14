import mongoose from 'mongoose';
import envConfig from './envConfig.js';

const dbConnect = async () => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
};

export default dbConnect;