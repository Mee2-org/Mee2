import { EmbedBuilder } from "discord.js";
import { createEvent } from "../../internal/helpers";

export default createEvent<"actionCreate">({
    name: "actionCreate",
    once: false
}, async (action) => {
    const { ctx } = action;

    const guild = await ctx.prisma.guild.findUnique({ 
        where: { guildId: action.guild.id }, 
        include: { moderation: true }
    });

    if (!guild?.moderation?.log_channel) return;
    const channel = await action.guild.channels.fetch(guild.moderation.log_channel).catch(console.error);
    if (!channel) return;
    if (!channel.isSendable()) return;

    if (action.type === "ban") {
        const embed = new EmbedBuilder()
        .setAuthor({ name: action.target.username, iconURL: action.target.displayAvatarURL() })
        .setTitle(`Case #${action.case.caseId}`)
        .setDescription(`**Target:** ${action.target}\n**Reason:** ${action.reason}`)
        .setFooter({ text: action.moderator.displayName, iconURL: action.moderator.displayAvatarURL() })
        .setColor("Yellow")
        .setTimestamp();

        return await channel.send({ embeds: [embed] });
    }
});