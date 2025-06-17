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

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/servers', serverRoutes);
app.use('/channels', channelRoutes);
app.use('/messages', messageRoutes);

app.get('/', (_req, res) => {
    res.send('Frostclad backend with Socket.IO is running!');
});

// Remove all Socket.IO/voice chat logic (leave only this for future)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

// (No voice chat, no WebRTC, no socket events here)

httpServer.listen(PORT, () => {
    console.log('✅ Server initialized');
    console.log(`✅ Frostclad backend running at http://localhost:${PORT}`);
});


