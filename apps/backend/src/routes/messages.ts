import express, { Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Send a message to a channel
router.post('/:channelId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { content } = req.body;
    const { channelId } = req.params;

    if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                channelId,
                userId: req.userId!,
            },
        });

        res.status(201).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not send message' });
    }
});

// Get all messages in a channel
router.get('/:channelId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { channelId } = req.params;

    try {
        const messages = await prisma.message.findMany({
            where: { channelId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch messages' });
    }
});

export default router;
