import express, { Request, Response } from 'express';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create a new server
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {

    const { name } = req.body;

    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;

    }

    try {
        const server = await prisma.server.create({
            data: {
                name,
                ownerId: req.userId!,
                members: {
                    connect: { id: req.userId },
                },
            },
        });

        res.status(201).json(server);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server creation failed' });
    }
});

// Get all servers the user is in
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const servers = await prisma.server.findMany({
            where: {
                members: {
                    some: { id: req.userId },
                },
            },
        });

        res.json(servers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not fetch servers' });
    }
});

// Join a server by ID
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

// Leave a server
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

export default router;
