import { Collection } from "discord.js";
import { Command } from "./helpers/Command";
import { Logger } from "./helpers/Logger";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>
        logger: Logger
    }
}