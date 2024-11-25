import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";

export const prisma = new PrismaClient();

export function ConnectDatabase(client: Client) {
    prisma.$connect()
    .then(() => {
        client.logger.success("fn(CB)", "Prisma connected to MongoDB.");
    })
    .catch((reason) => client.logger.error("fn(CB)", reason));
}
