import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: true, // Automatically reflects the request origin, fully supporting Vercel preview/production URLs
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Routes import
import authRouter from './routes/auth.routes.js';
import contentRouter from './routes/content.routes.js';

// Routes declaration
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/content', contentRouter);

// Simple health check route
app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'active', message: 'Backend is running perfectly' });
});

export { app };
