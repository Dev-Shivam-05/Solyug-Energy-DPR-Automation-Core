import express from 'express';
import envConfig from './config/envConfig.js';
import dbConnect from './config/database.js';
import router from './routers/leadRoutes.js';
import healthRouter from './routers/healthRoutes.js';

const app = express();
const port = envConfig.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/api/v1`,router);
app.use(`/api/v1/health`,healthRouter);

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server Started Successfully`);
    console.log(`http://localhost:${port}/`);
    return;
  }
});