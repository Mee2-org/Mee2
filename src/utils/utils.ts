import { EmbedBuilder, GuildMember, PermissionsString } from "discord.js";

export function createWarning(description: string, title?: string) {
    const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor("Orange")
    .setTimestamp();
     
    if (title) embed.setTitle(`⚠️ | ${title}`);
    return { embeds: [embed] };
}

export async function hasPermissions(member: GuildMember | null, permissions: PermissionsString[], ff?: boolean) {
    if (typeof ff === "undefined") ff = false;
    
    if (!member) return [false, permissions.join(", ")]

    if (ff) await member.fetch().catch(console.error);

    if (!member.permissions.has(permissions)) {
        return [false, permissions.join(", ")];
    }

    return [true, permissions.join(", ")];
}