import express from 'express';
import nodePath from 'path';
import { fileURLToPath } from 'url';
import envConfig from './config/envConfig.js';
import dbConnect from './config/database.js';
import exerciseRouter from './routers/exerciseRoutes.js';
import healthRouter from './routers/healthRoutes.js';

// Connect to database
dbConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = nodePath.dirname(__filename);

const app = express();
const port = envConfig.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve API routes
app.use(`/api/v1`, exerciseRouter);
app.use(`/api/v1`, healthRouter);

// Serve static assets from the frontend build folder
const frontendDistPath = nodePath.join(__dirname, '../Yoga-Frontend-Core/dist');
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(nodePath.join(frontendDistPath, 'index.html'));
  }
  next();
});

app.listen(port, (err) => {
  if (!err) {
    console.log(`Yoga Platform Backend Started Successfully`);
    console.log(`http://localhost:${port}/`);
    return;
  }
});