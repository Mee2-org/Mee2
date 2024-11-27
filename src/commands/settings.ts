import { createCommand } from "../internal/helpers";
import { ChannelType, SlashCommandBuilder } from "discord.js";

export default createCommand(
    new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure various settings for this server.")

    .addSubcommand((option) => {
        return option
        .setName("welcome")
        .setDescription("Configure the welcome settings for this server.")

        .addBooleanOption((bo) => {
            return bo
            .setName("enabled")
            .setDescription("Enable / Disable the welcome module in this server")
            .setRequired(true)
        })
        
        .addChannelOption((co) => {
            return co
            .setName("channel")
            .setDescription("Select the channel to send welcome messages.")
            .addChannelTypes([ChannelType.GuildText])
            .setRequired(false)
        })
    }), undefined,
    { 
        permissions: { 
            guild_only: true,
            member_permissions: ["ManageGuild"]
        } 
    }
)