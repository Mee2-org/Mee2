import { GatewayIntentBits } from "discord.js";
import "./env";

export interface IConfig {
    token: string; // Bot token.
    intents: GatewayIntentBits[]; // List of intents bot requires.
    shards: "auto" | number; // Used in the client options.
    developers: string[], // List of developer, tester & owner ID's
    debug: boolean; // Enable / Disable debug logging (used in Logger)
}

export default Object.freeze({
    token: process.env.DISCORD_TOKEN,
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    shards: "auto",
    developers: [""],
    debug: true,
});