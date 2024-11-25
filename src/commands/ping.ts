import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { createCommand } from "../internal/helpers";

export default createCommand(
    new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's ping!"),
    (ctx) => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: ctx.interaction.user.username, iconURL: ctx.interaction.user.displayAvatarURL() })
        .setDescription(`🖥️ | Ping: **${ctx.client.ws.ping}**ms`)
        .setColor("Random")
        .setTimestamp();

        return ctx.interaction.reply({ embeds: [embed] });
    }
)