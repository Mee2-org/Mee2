import { ChannelType, EmbedBuilder } from "discord.js";
import { CommandContext } from "../../../../internal/helpers";

export async function run(ctx: CommandContext<"cached">) {
    await ctx.interaction.deferReply({ ephemeral: true });

    const channel = ctx.interaction.options.getChannel("channel", false, [ChannelType.GuildText]);

    if (!channel) {
        await ctx.prisma.guild.update({
            where: { guildId: ctx.interaction.guildId },
            data: {
                moderation: {
                    upsert: {
                        create: { log_channel: null },
                        update: { log_channel: null }
                    }
                }
            }
        });

        const embed = new EmbedBuilder()
        .setAuthor({ name: ctx.interaction.guild.name, iconURL: ctx.interaction.guild.iconURL()! })
        .setDescription(`:white_check_mark: | Removed moderation log channel.`)
        .setColor("Blurple")
        .setTimestamp();

        return ctx.interaction.editReply({ embeds: [embed] });
    }

    await ctx.prisma.guild.update({
        where: { guildId: ctx.interaction.guildId },
        data: {
            moderation: {
                upsert: {
                    create: { log_channel: channel.id },
                    update: { log_channel: channel.id }
                }
            }
        }
    });

    const embed = new EmbedBuilder()
    .setAuthor({ name: ctx.interaction.guild.name, iconURL: ctx.interaction.guild.iconURL()! })
    .setDescription(`:white_check_mark: | Set ${channel} as the moderation log channel.`)
    .setColor("Blurple")
    .setTimestamp();

    return ctx.interaction.editReply({ embeds: [embed] });
}