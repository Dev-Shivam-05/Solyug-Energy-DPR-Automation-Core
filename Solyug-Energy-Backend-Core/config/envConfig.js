import "dotenv/config";

const envConfig = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MongoDB_URl,
};

export default envConfig;