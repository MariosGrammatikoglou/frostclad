import express, { Request, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { generateInviteCode, getInviteExpiryDate } from '../utils/invite';

const router = express.Router();

// ✅ Create a new server with a default general channel
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }

    try {
        const inviteCode = generateInviteCode();
        const inviteExpiresAt = getInviteExpiryDate();

        const server = await prisma.server.create({
            data: {
                name,
                ownerId: req.userId!,
                inviteCode,
                inviteExpiresAt,
                members: {
                    connect: { id: req.userId },
                },
                channels: {
                    createMany: {
                        data: [
                            { name: 'general', type: 'text' }
                        ]
                    }
                }

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

// ✅ Get a single server (protected: only members)
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const serverId = req.params.id;

    try {
        // 🛡️ Check membership
        const membership = await prisma.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: { id: req.userId },
                },
            },
            select: {
                id: true,
                name: true,
                ownerId: true,
                inviteCode: true,
                inviteExpiresAt: true,
            },
        });

        if (!membership) {
            res.status(403).json({ error: 'Not a member of this server' });
            return;
        }

        let { inviteCode, inviteExpiresAt } = membership;

        const now = new Date();
        if (!inviteExpiresAt || inviteExpiresAt < now) {
            inviteCode = generateInviteCode();
            inviteExpiresAt = getInviteExpiryDate();

            await prisma.server.update({
                where: { id: membership.id },
                data: { inviteCode, inviteExpiresAt },
            });
        }

        res.json({
            id: membership.id,
            name: membership.name,
            ownerId: membership.ownerId,
            inviteCode,
            inviteExpiresAt,
        });
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
router.post('/join/:inviteCode', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    const inviteCode = req.params.inviteCode;

    console.log('Trying to join with code:', inviteCode);

    try {
        const server = await prisma.server.findFirst({
            where: {
                inviteCode,
                inviteExpiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!server) {
            res.status(404).json({ error: 'Invalid or expired invite code' });
            return;
        }

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
