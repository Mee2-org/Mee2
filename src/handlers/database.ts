import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";

export const prisma = new PrismaClient({ 
    log: [
        { level: "query", emit: "event" },
        { level: "info", emit: "event" },
        { level: "warn", emit: "stdout" },
        { level: "error", emit: "stdout" }
    ],
    errorFormat: "pretty"
});

export function ConnectDatabase(client: Client) {
    prisma.$on("query", (event) => {
        const query = event.query.split("(");
        client.logger.info(`db(prisma:query)`, `[${event.timestamp}] ${query.at(0)}`)
    });

    prisma.$on("info", (event) => {
        client.logger.info(`db(prisma:info)`, `[${event.timestamp}] ${event.message}`)
    });

    prisma.$connect()
    .then(() => client.logger.success("db", "Prisma connected to MongoDB."))
    .catch(async (reason) => {
        client.logger.error("db", reason);
        await prisma.$disconnect()
    });
}
