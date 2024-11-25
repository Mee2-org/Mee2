import { ChannelType, EmbedBuilder } from "discord.js";
import { CommandContext } from "../../../internal/helpers";

export async function run(ctx: CommandContext) {
    await ctx.interaction.deferReply();

    const status = ctx.interaction.options.getBoolean("enabled", true);
    const channel = ctx.interaction.options.getChannel("channel", false, [ChannelType.GuildText]);

    // Request: Disable the welcome module.
    if (status === false) {
        await ctx.prisma.guild.update({
            where: { guildId: ctx.interaction.guildId },
            data: {
                settings: {
                    upsert: {
                        create: {
                            welcome_status: false,
                            welcome_channel: null
                        },

                        update: {
                            welcome_status: false,
                            welcome_channel: null
                        }
                    }
                }
            },
            include: { settings: true }
        });

        const embed = new EmbedBuilder()
        .setAuthor({ name: ctx.interaction.guild.name, iconURL: ctx.interaction.guild.iconURL()! })
        .setDescription(`:white_check_mark: | Disabled **welcome** module.`)
        .setColor('Blurple')
        .setTimestamp();

        return ctx.interaction.editReply({ embeds: [embed] });
    }

    // Request: Enable the welcome module.
    if (!channel) {
        const embed = new EmbedBuilder()
        .setAuthor({ name: ctx.interaction.user.username, iconURL: ctx.interaction.user.displayAvatarURL() })
        .setDescription(`:x: | Expected a channel option but none was provided.`)
        .setColor('Orange')
        .setTimestamp();

        return ctx.interaction.editReply({ embeds: [embed] });
    }

    const updated = await ctx.prisma.guild.update({
        include: { settings: true },
        where: { guildId: ctx.interaction.guildId },
        data: {
            settings: {
                upsert: {
                    create: {
                        welcome_channel: channel.id,
                        welcome_status: status
                    },

                    update: {
                        welcome_channel: channel.id,
                        welcome_status: status
                    }
                }
            }
        }
    });

    const embed = new EmbedBuilder()
    .setAuthor({ name: ctx.interaction.guild.name, iconURL: ctx.interaction.guild.iconURL()! })
    .setDescription(`:white_check_mark: | Enabled **welcome** module with channel as <#${updated.settings?.welcome_channel}>`)
    .setColor('Blurple')
    .setTimestamp();

    return ctx.interaction.editReply({ embeds: [embed] });
}