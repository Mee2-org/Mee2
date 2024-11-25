import "./internal/prestart"
import { Client, Collection } from "discord.js";
import { Logger } from "./internal/helpers";
import { Command, Database, Event } from "./handlers";
import config from "./internal/config";

const client = new Client({ intents: config.intents });

client.commands = new Collection();
client.logger = new Logger({ tag: "client" });

async function main() {
    try {
        Database(client);
        await Event(client);
        await Command(client);
        await client.login(config.token);
    } catch (error) {
        client.logger.error("fn(main)", error)
    }
}

void main();