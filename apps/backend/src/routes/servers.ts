import express, { Request, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { generateInviteCode, getInviteExpiryDate } from '../utils/invite';

const router = express.Router();

// ✅ Create a new server with a default general channel
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const inviteCode = generateInviteCode();
        const inviteExpiresAt = getInviteExpiryDate();

        const server = await prisma.server.create({
            data: {
                name,
                ownerId: req.userId!,
                inviteCode,
                inviteExpiresAt,
                members: { connect: { id: req.userId } },
                channels: {
                    create: {
                        name: 'general',
                        type: 'text',
                    },
                },
            },
            include: {
                members: true,
                channels: true,
            },
        });
        res.status(201).json(server);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server creation failed' });
    }
});

// ✅ Get all servers the user is in
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const servers = await prisma.server.findMany({
            where: {
                members: {
                    some: { id: req.userId },
                },
            },
            select: {
                id: true,
                name: true,
            },
        });
        res.json(servers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch servers' });
    }
});

// ✅ Get a single server
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
    const serverId = req.params.id;
    try {
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            select: {
                id: true,
                name: true,
                ownerId: true,
                inviteCode: true,
                inviteExpiresAt: true,
            },
        });
        if (!server) return res.status(404).json({ error: 'Server not found' });

        const now = new Date();
        const validInvite = server.inviteExpiresAt && server.inviteExpiresAt > now
            ? server.inviteCode
            : null;

        res.json({ ...server, inviteCode: validInvite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch server' });
    }
});

// ✅ Join a server by ID
router.post('/:id/join', authenticateToken, async (req: AuthRequest, res: Response) => {
    const serverId = req.params.id;
    try {
        await prisma.server.update({
            where: { id: serverId },
            data: {
                members: {
                    connect: { id: req.userId },
                },
            },
        });
        res.json({ message: 'Joined server' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not join server' });
    }
});

// ✅ Leave a server
router.delete('/:id/leave', authenticateToken, async (req: AuthRequest, res: Response) => {
    const serverId = req.params.id;
    try {
        await prisma.server.update({
            where: { id: serverId },
            data: {
                members: {
                    disconnect: { id: req.userId },
                },
            },
        });
        res.json({ message: 'Left server' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not leave server' });
    }
});

// ✅ Join via invite code
router.post('/join/:inviteCode', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { inviteCode } = req.params;
    try {
        const server = await prisma.server.findFirst({
            where: {
                inviteCode,
                inviteExpiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!server) return res.status(404).json({ error: 'Invalid or expired invite code' });

        await prisma.server.update({
            where: { id: server.id },
            data: {
                members: { connect: { id: req.userId } },
            },
        });

        res.status(200).json({ message: 'Joined server', serverId: server.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to join server' });
    }
});

export default router;
