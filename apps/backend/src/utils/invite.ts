// apps/backend/src/utils/invite.ts
import { nanoid } from 'nanoid';

export function generateInviteCode(): string {
    return nanoid(10);
}

export function getInviteExpiryDate(): Date {
    const now = new Date();
    now.setDate(now.getDate() + 1); // expires in 1 day
    return now;
}
