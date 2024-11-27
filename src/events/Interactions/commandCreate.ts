import { CacheType } from "discord.js";
import { prisma } from "../../handlers";
import config from "../../internal/config";
import { CommandContext, createEvent } from "../../internal/helpers";
import { createWarning, hasPermissions } from "../../utils";

export default createEvent<"interactionCreate">({
    name: "interactionCreate", 
    once: false
}, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { client, user, options } = interaction;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.options) {
        const { permissions } = command.options;

        if (permissions?.owner_only) {
            if (!config.developers.includes(user.id)) {
                return interaction.reply(createWarning(`You can't use this command.`, "Developer Only Command"));
            }
        }

        if (permissions?.guild_only && !interaction.inGuild()) {
            return interaction.reply(createWarning("This command can't be used here.", "Server Only Command"));
        }

        if (interaction.inCachedGuild()) {
            if (permissions?.client_permissions) {
                const [has, perms] = await hasPermissions(interaction.guild.members.me, permissions.client_permissions, true);
                if (!has) {
                    return interaction.reply(createWarning(`I am missing these permissions: ${perms}`, "Missing Permissions"));
                }
            }
            
            if (permissions?.member_permissions) {
                const [has, perms] = await hasPermissions(interaction.member, permissions.member_permissions, true);
                if (!has) {
                    return interaction.reply(createWarning(`You are missing these permissions: ${perms}`, "Missing Permissions"));
                }
            }
        }
    }
    
    client.logger.info('event(interactionCreate)', `${user.username} used /${interaction.commandName}`);

    try {
        if (interaction.inGuild()) {
            await prisma.guild.upsert({
                where: { guildId: interaction.guildId },
                create: { guildId: interaction.guildId },
                update: { guildId: interaction.guildId }
            });
        }

        const context: CommandContext<CacheType> = {
            client,
            interaction,
            prisma
        };

        if (options.getSubcommand(false)) {
            const path = command.options?.path?.find(p => p.K === options.getSubcommand())?.V;
            (await import(`../../commands/sub/${path}`)).run(context);
        } else {
            const path = command.options?.path?.find(p => p.K === interaction.commandName)?.V;
            (await import(`../../commands/${path}`)).default.run(context);
        }
    } catch (error) {
        client.logger.error("event(interactionCreate)", error);
    }
});