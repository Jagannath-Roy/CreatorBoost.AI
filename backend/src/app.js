import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://creator-boost-ai.vercel.app",
        "https://creator-boost-ai-git-main-jagannath-roys-projects-cbed44e3.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || [],
    });
});

export { app };
