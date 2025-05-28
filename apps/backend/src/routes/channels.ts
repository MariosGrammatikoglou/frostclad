import express, { Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// ✅ Helper: Check if user is a member of a server
async function isServerMember(serverId: string, userId: string): Promise<boolean> {
    const server = await prisma.server.findUnique({
        where: { id: serverId },
        select: {
            members: {
                where: { id: userId },
                select: { id: true },
            },
        },
    });

    return !!server?.members.length;
}

// ✅ Create a channel in a specific server (owner-only)
router.post('/:serverId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, type } = req.body;
    const { serverId } = req.params;

    if (!name || !type) {
        res.status(400).json({ error: 'Name and type are required' });
        return;
    }

    try {
        const server = await prisma.server.findUnique({
            where: { id: serverId },
            select: { ownerId: true },
        });

        if (!server || server.ownerId !== req.userId) {
            res.status(403).json({ error: 'Only the server owner can create channels' });
            return;
        }

        const channel = await prisma.channel.create({
            data: {
                name,
                type,
                serverId,
            },
        });

        res.status(201).json(channel);
    } catch (err) {
        console.error('Failed to create channel:', err);
        res.status(500).json({ error: 'Could not create channel' });
    }
});

// ✅ Get all channels for a specific server
router.get('/server/:serverId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { serverId } = req.params;

    try {
        const isMember = await isServerMember(serverId, req.userId!);
        if (!isMember) {
            res.status(403).json({ error: 'Not a member of this server' });
            return;
        }
        const channels = await prisma.channel.findMany({
            where: { serverId },
            select: {
                id: true,
                name: true,
                type: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        res.status(200).json(channels);
    } catch (err) {
        console.error('Failed to fetch channels:', err);
        res.status(500).json({ error: 'Failed to fetch channels' });
    }
});

export default router;
