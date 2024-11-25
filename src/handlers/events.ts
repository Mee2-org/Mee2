import { RemoveTSPrefix } from ".";
import { Event } from "../internal/helpers";
import { Client } from "discord.js";
import FileSystem from "node:fs";

export async function ReadEvent(client: Client) {
    const folders = FileSystem.readdirSync("./src/events/");

    if (!folders) {
        client.logger.error("fn(ReadEvent)", Error("./src/events/ -> folders not found."));
        return;
    }

    for (const folder of folders) {
        const files = FileSystem.readdirSync(`./src/events/${folder}/`);

        for (const file of files) {
            const File = await import(`../events/${folder}/${RemoveTSPrefix(file)}`);
            const event = File.default as Event;
            const type = event.data.once ? "once" : "on";
            client[type](event.data.name, (...args) => event.run(...args));
        }
    }
}