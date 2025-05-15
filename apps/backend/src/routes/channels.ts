import express, { Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create a new channel in a server
router.post('/:serverId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, type } = req.body;
    const { serverId } = req.params;

    if (!name || !type) {
        res.status(400).json({ error: 'Name and type are required' });
        return;
    }

    try {
        const channel = await prisma.channel.create({
            data: {
                name,
                type,
                serverId,
            },
        });

        res.status(201).json(channel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not create channel' });
    }
});

// Get all channels for a server
router.get('/:serverId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { serverId } = req.params;

    try {
        const channels = await prisma.channel.findMany({
            where: { serverId },
        });

        res.status(200).json(channels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch channels' });
    }
});

export default router;
