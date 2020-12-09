import { Notification } from "../models/Notification";

export async function sendNotification(userId: string, content: string) {
    await new Notification({
            content,
            user: userId
    }).save();
}

export function parseMongoResult<T>(val: T): T {
    return JSON.parse(JSON.stringify(val));
}