import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { CommandContext } from "../../../internal/helpers";
import { createWarning } from "../../../utils";
import crypto from "node:crypto"

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
        if (interaction.customId === "--n") {
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(":white_check_mark: | Terminated ban process.")
            .setColor("Blurple")
            .setTimestamp();
            
            await ctx.interaction.deleteReply();
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        await interaction.deferUpdate();

        try {
            const DMEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL()! })
            .setDescription(`**You have been banned from ${interaction.guild.name}**\n\n#- Message Sent From: ${interaction.guild.name} (${interaction.guildId})`)
            .setColor("Red")
            .setTimestamp();

            await targetUser.send({ embeds: [DMEmbed] })
            .catch((rs) => ctx.client.logger.error(rs));

            await interaction.guild.bans.create(targetUser, { reason });

            const embed = new EmbedBuilder()
            .setDescription(`:white_check_mark: | ${targetUser.username} has been banned`)
            .setColor("Blurple")
            .setTimestamp();

            await interaction.editReply({ embeds: [embed], components: [] });

            const res = await ctx.prisma.cases.create({
                data: {
                    guildId: interaction.guildId,
                    userId: targetUser.id,
                    caseId: crypto.randomInt(10_000),
                    moderatorId: ctx.interaction.user.id,
                    reason,
                    createdAt: Date(),
                    deleteable: true,
                    editable: true
                }
            });

            ctx.client.emit("actionCreate", {
                ctx,
                reason,
                type: "ban",
                case: res,
                guild: interaction.guild,
                moderator: ctx.interaction.user,
                target: targetUser,
            })

            return;
        } catch (error) {
            ctx.client.logger.error("ban", error);
        }
    });
}