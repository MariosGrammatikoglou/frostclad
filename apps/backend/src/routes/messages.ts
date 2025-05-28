import express, { Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// ✅ Helper: Check if user is member of the channel’s server
async function validateUserAccess(channelId: string, userId: string) {
    const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        include: {
            server: {
                include: {
                    members: {
                        select: { id: true }
                    }
                }
            }
        }
    });

    if (!channel) return { ok: false, reason: 'Channel not found' };

    const isMember = channel.server.members.some((m) => m.id === userId);
    if (!isMember) return { ok: false, reason: 'Not a member' };

    return { ok: true };
}

// ✅ Send a message to a channel
router.post('/:channelId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { content } = req.body;
    const { channelId } = req.params;

    if (!content) {
        res.status(400).json({ error: 'Content is required' });
        return;
    }

    const check = await validateUserAccess(channelId, req.userId!);
    if (!check.ok) {
        res.status(check.reason === 'Not a member' ? 403 : 404).json({ error: check.reason });
        return;
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                channelId,
                userId: req.userId!,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        res.status(201).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not send message' });
    }
});

// ✅ Get all messages in a channel
router.get('/:channelId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { channelId } = req.params;

    const check = await validateUserAccess(channelId, req.userId!);
    if (!check.ok) {
        res.status(check.reason === 'Not a member' ? 403 : 404).json({ error: check.reason });
        return;
    }

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
