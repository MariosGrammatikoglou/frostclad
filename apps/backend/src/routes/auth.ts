import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// =======================
// POST /auth/register
// =======================
router.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        console.log('✅ Register attempt:', req.body);

        try {
            const { email, username, password } = req.body;

            if (!email || !username || !password) {
                res.status(400).json({ error: 'Missing fields' });
                return;
            }

            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                res.status(400).json({ error: 'Email already in use' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email,
                    username,
                    password: hashedPassword,
                },
            });

            res.status(201).json({
                message: 'User created',
                user: { id: user.id, email: user.email, username: user.username },
            });
        } catch (err) {
            console.error('❌ Register error:', err);
            next(err);
        }
    }
);

// =======================
// POST /auth/login
// =======================
router.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: 'Missing email or password' });
                return;
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(400).json({ error: 'Invalid credentials' });
                return;
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(400).json({ error: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: '1h',
            });

            res.status(200).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
            });
        } catch (err) {
            next(err);
        }
    }
);

router.get(
    '/me',
    authenticateToken,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: req.userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    createdAt: true,
                },
            });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.status(200).json({ user });
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);




export default router;
