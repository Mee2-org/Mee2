# Database

- Project uses mongodb
- Information: 
  - We don't collect message information like:
    - Content
    - Embed Info (any part of the embed)
    - Author
  - We don't collect server owner information.
  - We don't collect server member information.
    - We might collect this information if a admin/owner has given permissions to do so.
    - Or if the respective member has given permissions.
  - We don't server information that is not related or needed
    - GuildID is collected.
      - GuildID is a unique int given to every Discord Guild.
    - Ban information is collected.
      - This is an opt-in ft.
      - You can use the /settings cases to store ban information for every member.



# Information Collected

- **Last Updated:** 29/11/2024

## Guild

 - `guildId`
   - The guild ID that the document belongs to.
   - Using this ID we get information stored on the database.

- `settings`
  - `welcome_channel`
    - The welcome channel ID (only used if `welcome_status` is true)
    - The channel to send welcome messages.
  - `welcome_status`
    - Disable / Enable the welcome module.
    - A Boolean value.