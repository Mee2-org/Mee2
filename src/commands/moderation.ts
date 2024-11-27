import { ChannelType, SlashCommandBuilder } from "discord.js";
import { createCommand } from "../internal/helpers";

export default createCommand(
    new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("Moderation commands.")

    .addSubcommandGroup((commands) => {
        return commands
        .setName("settings")
        .setDescription("Moderation settings commands.")

        .addSubcommand((command) => {
            return command
            .setName("moderator_roles")
            .setDescription("The moderation roles: Roles assigned to moderators.")
        })

        .addSubcommand((command) => {
            return command
            .setName("log_channel")
            .setDescription("Log moderation actions in a channel.")
            .addChannelOption((option) => {
                return option
                .setName("channel")
                .setDescription("Keep it empty to disable.")
                .addChannelTypes([ChannelType.GuildText])
                .setRequired(false)
            })
        })
    })

    .addSubcommand((command) => {
        return command
        .setName("ban")
        .setDescription("Ban a member from this server.")
        .addUserOption((option) => {
            return option
            .setName("user")
            .setDescription("The user to ban.")
            .setRequired(true)
        })
        .addStringOption((option) => {
            return option
            .setName("reason")
            .setDescription("The reason to ban this member.")
            .setRequired(false)
            .setMaxLength(200)
        })
    }),
    
    undefined,
    {
        permissions: {
            guild_only: true,
            client_permissions: ["BanMembers", "ModerateMembers", "ManageMessages"]
        }
    }
)