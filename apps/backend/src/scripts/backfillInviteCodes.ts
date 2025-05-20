import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
    const servers = await prisma.server.findMany({
        where: { inviteCode: null },
    });

    for (const server of servers) {
        const code = nanoid(10); // short unique code
        await prisma.server.update({
            where: { id: server.id },
            data: { inviteCode: code },
        });
        console.log(`✅ Set inviteCode for server ${server.name}: ${code}`);
    }

    console.log('🎉 All missing invite codes have been backfilled!');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
