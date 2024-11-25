import { prisma } from "../../handlers";
import { CommandContext, createEvent } from "../../internal/helpers";

export default createEvent<"interactionCreate">({
    name: "interactionCreate", 
    once: false
}, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inCachedGuild()) return;
    
    const { client, user, options } = interaction;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    let guild = await prisma
    .guild
    .findUnique({ where: { guildId: interaction.guildId }, include: { settings: true } });

    if (!guild) {
        guild = await prisma
        .guild
        .create({ data: { guildId: interaction.guildId }, include: { settings: true } });
    }

    client.logger.info('event(interactionCreate)', `${user.username} used /${interaction.commandName}`);

    try {
        let command_path;
        if (options.getSubcommand()) {
            command_path = command.options?.path?.find(kv => kv.K === options.getSubcommand())?.V;
        } else {
            command_path = command.options?.path?.find(kv => kv.K === interaction.commandName)?.V;
        }

        const context: CommandContext = {
            interaction,
            prisma: prisma
        };

        (await import(`../../commands/sub/${command_path}`)).run(context);
    } catch (error) {
        client.logger.error("event(interactionCreate)", error);
    }
});