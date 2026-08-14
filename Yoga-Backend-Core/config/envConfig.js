import "dotenv/config";

const envConfig = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/yoga-platform",
};

export default envConfig;