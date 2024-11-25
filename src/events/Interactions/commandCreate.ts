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
        const context: CommandContext = {
            client,
            interaction,
            prisma: prisma
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