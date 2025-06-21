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

// Origins allowed for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://frostclad-frontend.vercel.app';
const LOCAL_URL = 'http://localhost:3000';
const allowedOrigins = [LOCAL_URL, FRONTEND_URL];

// Log allowed origins at startup
console.log('✅ Allowed origins:', allowedOrigins);

app.use(
    cors({
        origin: (origin, callback) => {
            console.log('➡️ Incoming request origin:', origin);

            if (!origin) {
                console.log('— No Origin header (e.g. mobile/Electron); allowing request');
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                console.log(`👍 Origin allowed: ${origin}`);
                return callback(null, true);
            }

            console.warn(`❌ Origin NOT allowed: ${origin}`);
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

// Redirect root to your frontend login
app.get('/', (_req, res) => {
    res.redirect(301, `${FRONTEND_URL}/login`);
});

// 404 for unknown routes
app.use((_req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Socket.io with same CORS policy
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

httpServer.listen(PORT, () => {
    console.log('✅ Frostclad backend running at http://localhost:' + PORT);
});
