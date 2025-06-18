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

// Update this with your actual deployed frontend URL!
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://frostclad-frontend.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

// Allow requests from your frontend (local + prod)
const allowedOrigins = [LOCAL_URL, FRONTEND_URL];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps, curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'), false);
            }
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

app.get('/', (_req, res) => {
    res.send('Frostclad backend with Socket.IO is running!');
});

// Socket.IO CORS: Should match the above
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});

// (No voice chat, no WebRTC, no socket events yet)

httpServer.listen(PORT, () => {
    console.log('✅ Server initialized');
    console.log(`✅ Frostclad backend running at http://localhost:${PORT}`);
});
