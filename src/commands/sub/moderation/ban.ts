import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { CommandContext } from "../../../internal/helpers";
import { createWarning } from "../../../utils";

export async function run(ctx: CommandContext<"cached">) {
    await ctx.interaction.deferReply({ fetchReply: true });

    const guild = await ctx.prisma.guild.findUnique({ 
        where: { guildId: ctx.interaction.guildId },
        include: { moderation: true },
    });

    if (guild?.moderation?.moderation_roles) {
        if (!ctx.interaction.member.roles.cache.hasAny(...guild.moderation.moderation_roles)) {
            return await ctx.interaction.editReply(createWarning(`You don't have a moderator role.`, "Not Enough Permissions"));
        }
    } else if (!ctx.interaction.member.permissions.has("BanMembers")) {
        return await ctx.interaction.editReply(createWarning(`You don't have BanMembers permissions.`, "Missing Permission"));
    }

    const targetMember = ctx.interaction.options.getMember("user");
    const targetUser = ctx.interaction.options.getUser("user", true);
    const reason = ctx.interaction.options.getString("reason") || "No Reason Provided";
    
    const confirmation = new EmbedBuilder()
    .setAuthor({ name: targetUser.username, iconURL: targetUser.displayAvatarURL() })
    .setTitle("⚠️ | Confirm Action")
    .setDescription(`- *Are you sure you want to ban: ${targetUser} (${targetUser.id})*\n\n- **Reason:** ${reason}`)
    .setColor("Blurple")
    .setTimestamp();
    
    const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("--y")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Danger),
        
        new ButtonBuilder()
        .setCustomId("--n")
        .setLabel("No")
        .setStyle(ButtonStyle.Secondary)
    );

    if (targetMember) {
        if (!targetMember.bannable) {
            return await ctx.interaction.editReply(createWarning(`I can't ban this member.`, "Not Enough Permissions"));
        }
    }
    
    const messsage = await ctx.interaction.editReply({ embeds: [confirmation], components: [row] });
    
    const collector = messsage.createMessageComponentCollector({ 
        componentType: ComponentType.Button, 
        filter: (i) => i.user.id === ctx.interaction.user.id,
        max: 1
    });
    
    collector.on("collect", async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        
        if (interaction.customId === "--n") {
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(":white_check_mark: | Terminated ban process.")
            .setColor("Blurple")
            .setTimestamp();
            
            await ctx.interaction.deleteReply();
            await interaction.editReply({ embeds: [embed] });
            return;
        }
    });
}