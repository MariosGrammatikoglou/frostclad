import express from 'express';
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
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: 'http://localhost:3000', // ✅ frontend origin only
        credentials: true,               // ✅ allow cookies & auth headers
    })
);

app.use(express.json());

// ✅ REST API routes
app.use('/auth', authRoutes);
app.use('/servers', serverRoutes);
app.use('/channels', channelRoutes);
app.use('/messages', messageRoutes);

// ✅ Base route
app.get('/', (_req, res) => {
    res.send('Frostclad backend with Socket.IO is running!');
});

// ✅ Socket.IO real-time logic
io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    // TEXT: Join a text channel
    socket.on('join-channel', (channelId: string) => {
        socket.join(channelId);
        console.log(`💬 ${socket.id} joined text channel ${channelId}`);
    });

    // TEXT: Send message
    socket.on('send-message', ({ channelId, message }) => {
        socket.to(channelId).emit('receive-message', {
            message,
            senderId: socket.id,
            timestamp: new Date(),
        });
    });

    // 🎤 Voice Room Presence
    const voiceRooms: Record<string, Set<string>> = {};

    // VOICE: Join voice channel
    socket.on('join-voice', (channelId: string) => {
        socket.join(`voice-${channelId}`);

        if (!voiceRooms[channelId]) {
            voiceRooms[channelId] = new Set();
        }
        voiceRooms[channelId].add(socket.id);

        io.to(`voice-${channelId}`).emit('voice-peers', Array.from(voiceRooms[channelId]));
        console.log(`🎤 ${socket.id} joined voice ${channelId}`);
    });

    // VOICE: Leave voice channel
    socket.on('leave-voice', (channelId: string) => {
        socket.leave(`voice-${channelId}`);
        voiceRooms[channelId]?.delete(socket.id);

        io.to(`voice-${channelId}`).emit('voice-peers', Array.from(voiceRooms[channelId]));
        console.log(`🔇 ${socket.id} left voice ${channelId}`);
    });

    // DISCONNECT: cleanup all voice channels
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

// ✅ Start the server
httpServer.listen(PORT, () => {
    console.log(`✅ Frostclad backend running at http://localhost:${PORT}`);
});
