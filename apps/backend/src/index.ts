import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import serverRoutes from './routes/servers';
import channelRoutes from './routes/channels';
import messageRoutes from './routes/messages';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://frostclad-frontend.vercel.app';
const LOCAL_URL = 'http://localhost:3000';
const allowedOrigins = [LOCAL_URL, FRONTEND_URL];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'), false);
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/servers', serverRoutes);
app.use('/channels', channelRoutes);
app.use('/messages', messageRoutes);

// 🔁 Permanent redirect from backend root to frontend /login
app.get('/', (_req, res) => {
    res.redirect(301, `${FRONTEND_URL}/login`);
});

// Optional: Handle all unknown backend routes with a 404 JSON response
app.use((_req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

httpServer.listen(PORT, () => {
    console.log('✅ Frostclad backend running at http://localhost:' + PORT);
});
