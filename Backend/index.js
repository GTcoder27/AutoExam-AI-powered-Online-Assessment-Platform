import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import modelRoutes from './routes/model.route.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
// // allowedHeaders: ["Content-Type", "Authorization"]  //Add other headers you want to pass through CORS request
// }));






app.use("/api",modelRoutes);









// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Backend Zinda Hai',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(3000,()=>{
    console.log('server is running on port '+ 3000);
});

 





