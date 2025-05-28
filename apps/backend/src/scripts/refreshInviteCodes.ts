// apps/backend/scripts/refreshInviteCodes.ts
import { PrismaClient } from '@prisma/client';
import { generateInviteCode, getInviteExpiryDate } from '../utils/invite';


const prisma = new PrismaClient();

async function refreshInviteCodes() {
    const servers = await prisma.server.findMany();

    for (const server of servers) {
        const code = generateInviteCode();
        const expiresAt = getInviteExpiryDate();

        await prisma.server.update({
            where: { id: server.id },
            data: {
                inviteCode: code,
                inviteExpiresAt: expiresAt,
            },
        });

        console.log(`🔁 Refreshed invite code for "${server.name}" → ${code} (expires ${expiresAt.toISOString()})`);
    }

    console.log('✅ All invite codes have been refreshed.');
    await prisma.$disconnect();
}

refreshInviteCodes().catch((err) => {
    console.error('❌ Failed to refresh invite codes:', err);
    prisma.$disconnect();
    process.exit(1);
});
