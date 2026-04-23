import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
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
