import express from 'express';
import dotenv from 'dotenv'; 

import cors from 'cors';
import connectDB from './config/db.config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import socialRoutes from './routes/social.routes';
import statsRoutes from './routes/stats.routes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Add CORS middleware
app.use(cors({
    origin: ['http://localhost:4200', 'https://portfoliobe2025.up.railway.app'], // Allow requests from multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow credentials if needed
  }));
app.use(express.json());

// Add a new route to show "Hello"
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Portfolio Backend API',
    status: 'active'
  });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/', socialRoutes);
app.use('/api/v1/', statsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});