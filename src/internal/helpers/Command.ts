import {
    type RESTPostAPIChatInputApplicationCommandsJSONBody,
    type RESTPutAPIApplicationCommandsJSONBody,
    ChatInputCommandInteraction, 
    Client, 
    PermissionsString,
    Routes,
    SlashCommandBuilder, 
    SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

export enum HandleTypes {
    Command = 0,
    Handler = 1
}

export interface CommandPermissions {
    owner_only?: boolean;
    guild_only?: boolean;
    member_permissions?: PermissionsString[];
    client_permissions?: PermissionsString[];
}

export interface CommandOptions {
    handle_type?: HandleTypes;
    permissions?: CommandPermissions;
}

export interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    run: ((interaction: ChatInputCommandInteraction) => unknown) | undefined;
    options: CommandOptions;
}

export function createCommand(
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
    run?: ((interaction: ChatInputCommandInteraction) => unknown) | undefined,
    _options?: CommandOptions
) {
    const options = _options ?? {
        handle_type: HandleTypes.Command,
        permissions: {
            owner_only: false,
            guild_only: false,
            member_permissions: undefined,
            client_permissions: undefined
        }
    }

    return {
        data,
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

export async function registerApplicationCommands(client: Client<true>) {
    client.logger.info("fn(RAC)", `Checking for command changes...`);
    let hit = false;
    const application = await client.application.fetch();
    const commands = await application.commands.fetch();

    if (client.commands.size > commands.size) {
        client.logger.info("fn(RAC)", `Change found. Size difference.`);
        deployApplicationCommands(client);
        hit = true;
    }

    if (hit) {
        for (const command of [...client.commands.values()]) {
            const thisCommand = commands.get(command.data.name);
            
            if (!thisCommand) {
                client.logger.info("fn(RAC)", `${command.data.name} is not found in deployed commands. Deploying commands.`);
                deployApplicationCommands(client);
                hit = true;
                continue;
            }
        }
    }
    
    client.logger.success(`Completed check, Deployed commands: ${hit}`);
}