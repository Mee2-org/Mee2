import { PrismaClient } from "@prisma/client";
import {
    type RESTPutAPIApplicationCommandsJSONBody,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction, 
    Client, 
    PermissionsString,
    Routes,
    SlashCommandBuilder, 
    SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import { RawApplicationCommandData } from "discord.js/typings/rawDataTypes";

export interface CommandPermissions {
    owner_only?: boolean;
    guild_only?: boolean;
    member_permissions?: PermissionsString[];
    client_permissions?: PermissionsString[];
}

export interface CommandOptions {
    permissions?: CommandPermissions;
    path?: { K: string; V: string }[];
}

export interface Command {
    data: RawApplicationCommandData;
    run?: ((interaction: ChatInputCommandInteraction) => unknown) | undefined;
    options?: CommandOptions;
}

export interface CommandContext {
    client: Client<true>;
    interaction: ChatInputCommandInteraction<"cached">;
    prisma: PrismaClient
}

export function createCommand(
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
    run?: ((ctx: CommandContext) => unknown) | undefined,
    _options?: CommandOptions
) {
    const options = _options ?? {
        permissions: {
            owner_only: false,
            guild_only: false,
            member_permissions: undefined,
            client_permissions: undefined
        }
    }

    const j_data = data.toJSON();
    options.path = [{ K: j_data.name, V: `${j_data.name}` }];

    if (j_data.options) {
        for (const option of j_data.options) {
            if (option.type === ApplicationCommandOptionType.Subcommand) {
                options.path = [{ K: option.name, V: `${data.name}/${option.name}` }];
            }

            if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
                if (option.options) {
                    for (const sub of option.options) {
                        options.path = [{ K: sub.name, V: `${data.name}/${option.name}/${sub.name}` }];
                    }
                }
            }
        }
    }

    return {
        data: j_data,
        run,
        options
    }
}

export async function deployApplicationCommands(client: Client) {
    const commands = [];
    for (const command of [...client.commands.values()]) {
        commands.push(command.data);
    }

    client.rest.setToken(process.env.DISCORD_TOKEN);
    client.logger.info("fn(DAC)", `Deploying commands to Discord.`);

    const data = await client.rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands
    }) as RESTPutAPIApplicationCommandsJSONBody[];

    client.logger.success("fn(DAC)", `Deployed ${data.length} commands to Discord.`);

    return data;
}