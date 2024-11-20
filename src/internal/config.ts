import { GatewayIntentBits } from "discord.js";
import "./env";

export interface IConfig {
    token: string;
    intents: GatewayIntentBits[];
    debug: boolean;

    handlers: {
        events: string;
    }
}

export default Object.freeze({
    token: process.env.DISCORD_TOKEN,
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    debug: true,

    handlers: {
        events: "events"
    }
});