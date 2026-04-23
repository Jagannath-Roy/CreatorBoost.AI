import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Reflect the exact origin back to the client to bypass wildcard (*) restrictions when credentials: true
        if (!origin) return callback(null, true);
        return callback(null, origin);
    },
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

export { app };
