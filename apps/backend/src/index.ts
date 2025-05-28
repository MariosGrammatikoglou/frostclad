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

// ✅ Middleware Order Matters
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // ✅ After express.json()

// ✅ API Routes
app.use('/auth', authRoutes);
app.use('/servers', serverRoutes);
app.use('/channels', channelRoutes);
app.use('/messages', messageRoutes);

// ✅ Health Check
app.get('/', (_req, res) => {
    res.send('Frostclad backend with Socket.IO is running!');
});

// ✅ Real-time Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
});

const voiceRooms: Record<string, Set<string>> = {};

io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('join-channel', (channelId: string) => {
        socket.join(channelId);
        console.log(`💬 ${socket.id} joined text channel ${channelId}`);
    });

    socket.on('send-message', ({ channelId, message }) => {
        socket.to(channelId).emit('receive-message', {
            ...message,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on('join-voice', (channelId: string) => {
        socket.join(`voice-${channelId}`);
        if (!voiceRooms[channelId]) voiceRooms[channelId] = new Set();
        voiceRooms[channelId].add(socket.id);
        io.to(`voice-${channelId}`).emit('voice-peers', Array.from(voiceRooms[channelId]));
        console.log(`🎤 ${socket.id} joined voice ${channelId}`);
    });

    socket.on('leave-voice', (channelId: string) => {
        socket.leave(`voice-${channelId}`);
        voiceRooms[channelId]?.delete(socket.id);
        io.to(`voice-${channelId}`).emit('voice-peers', Array.from(voiceRooms[channelId]));
        console.log(`🔇 ${socket.id} left voice ${channelId}`);
    });

    socket.on('disconnect', () => {
        for (const [channelId, members] of Object.entries(voiceRooms)) {
            if (members.has(socket.id)) {
                members.delete(socket.id);
                io.to(`voice-${channelId}`).emit('voice-peers', Array.from(members));
                console.log(`🔴 ${socket.id} disconnected from voice ${channelId}`);
            }
        }
        console.log('🔴 Socket disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`✅ Frostclad backend running at http://localhost:${PORT}`);
});
