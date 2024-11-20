import { Client } from "discord.js";
import { RemoveTSPrefix } from ".";
import { Command, HandleTypes } from "@/internal/helpers";
import FileSystem from "node:fs";

export async function ReadCommand(client: Client) {
    const files = FileSystem.readdirSync("./src/commands/");
    
    for (const file of files) {
        const File = await import(`../commands/${RemoveTSPrefix(file)}`);
        const command: Command = File.default;

        if (command.options.handle_type === HandleTypes.Command) {
            if (!command.run) {
                client.logger.warn("fn(ReadCommand)", `Command (${command.data.name}) does not have a .run property.`);
            }
        }

        client.commands.set(command.data.name, command);
    }
}