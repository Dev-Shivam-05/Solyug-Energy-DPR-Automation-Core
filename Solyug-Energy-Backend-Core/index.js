import express from 'express';
import nodePath from 'path';
import { fileURLToPath } from 'url';
import envConfig from './config/envConfig.js';
import dbConnect from './config/database.js';
import router from './routers/leadRoutes.js';
import healthRouter from './routers/healthRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = nodePath.dirname(__filename);

const app = express();
const port = envConfig.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API routes first
app.use(`/api/v1`, router);
app.use(`/api/v1/health`, healthRouter);

// Serve static assets from the frontend build folder
const frontendDistPath = nodePath.join(__dirname, '../solar-configurator-frontend/dist');
app.use(express.static(frontendDistPath));

// Custom middleware for fallback SPA routing to completely bypass path-to-regexp wildcard parsing issues in Express v5
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(nodePath.join(frontendDistPath, 'index.html'));
  }
  next();
});

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server Started Successfully`);
    console.log(`http://localhost:${port}/`);
    return;
  }
});