import { Guild, GuildMember, User } from "discord.js";
import { CommandContext } from "./helpers";
import { Cases } from "@prisma/client";

export interface ActionCreateContext {
    type: string;
    guild: Guild;
    moderator: User | GuildMember;
    target: User;
    case: Cases;
    reason?: string;
    ctx: CommandContext;
}