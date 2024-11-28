import { CommandContext } from "../../../../internal/helpers";
import { createWarning, hasPermissions } from "../../../../utils";
import { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ComponentType, RoleSelectMenuInteraction } from "discord.js";  

export async function run(ctx: CommandContext<"cached">) {
    await ctx.interaction.deferReply({ ephemeral: true, fetchReply: true });

    const [has, perms] = await hasPermissions(ctx.interaction.member, ["ManageGuild"]);

    if (!has) {
        return ctx.interaction.editReply(createWarning(`You need these permissions: ${perms}`, "Missing Permissions"));
    }

    const guild = await ctx.prisma.guild.findUnique({ 
        where: { guildId: ctx.interaction.guildId }, 
        include: { moderation: true } 
    });

    const roleSelect = new RoleSelectMenuBuilder()
    .setCustomId("moderation_roles")
    .setPlaceholder("Select a role!")
    .setMaxValues(25)

    if (guild?.moderation?.moderation_roles) {
        roleSelect.addDefaultRoles(guild.moderation.moderation_roles);
    }
   
    console.log(guild?.moderation?.moderation_roles)

    const row = new ActionRowBuilder<RoleSelectMenuBuilder>()
    .setComponents(roleSelect);

    const embed = new EmbedBuilder()
    .setAuthor({ name: ctx.interaction.guild.name, iconURL: ctx.interaction.guild.iconURL()! })
    .setDescription(`:star: | Select roles that can moderate other members, using the bot.`)
    .setColor("Blurple")
    .setTimestamp();

    const message = await ctx.interaction.editReply({ embeds: [embed], components: [row] });

    const collector = message.createMessageComponentCollector({ componentType: ComponentType.RoleSelect });

    collector.on("collect", async (interaction: RoleSelectMenuInteraction<"cached">) => {
        await interaction.deferUpdate();
        const roleIDs = interaction.values;

        await ctx.prisma.guild.update({
            where: { guildId: interaction.guildId },
            data: {
                moderation: {
                    upsert: {
                        create: { moderation_roles: { set: roleIDs } },
                        update: { moderation_roles: { set: roleIDs } }
                    },
                }
            },
            include: { settings: true, moderation: true }
        });

        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL()! })
        .setDescription(`:white_check_mark: | Updated moderation roles.\n  - There is **${roleIDs.length}** moderation roles.`)
        .setColor("Blurple")
        .setTimestamp();

        return interaction.editReply({ embeds: [embed], components: [] });
    });
}