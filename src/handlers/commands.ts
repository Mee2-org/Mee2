import { Client } from "discord.js";
import { RemoveTSPrefix } from ".";
import { Command } from "../internal/helpers";
import FileSystem from "node:fs";

export async function ReadCommand(client: Client) {
    const files = FileSystem.readdirSync("./src/commands/").filter(i => i != "sub");
    
    for (const file of files) {
        const File = await import(`../commands/${RemoveTSPrefix(file)}`);
        const command: Command = File.default;
        
        if (!command) {
            client.logger.warn("fn(ReadCommand)", `${file} does not have command data.`);
        }

        client.commands.set(command.data.name, command);
    }
}