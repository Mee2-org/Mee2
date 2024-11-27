import { SlashCommandBuilder } from "discord.js";
import { CommandContext, createCommand } from "../../internal/helpers";

// Note: In every example, it should be: 
// export default createCommand() and so on...
// A file cannot have multiple default exports.

// Say if command has no sub commands,
// that command will be handled in the command file.
// So....
export const example_simple = createCommand(
    new SlashCommandBuilder()
    .setName("example")
    .setDescription("This is a example"),
    (ctx) => ctx.interaction.reply("It would be handled like so!"),
    { /* Options */ }
)

// Now lets say that the example command has a subcommand
// It would be like...

/* commands/example.ts */ 
export const example_subcommands = createCommand(
    new SlashCommandBuilder()
    .setName("example")
    .setDescription("This is a example")
    .addSubcommand((command) => {
        return command
        .setName("subcommand")
        .setDescription("This is a example subcommand")
    })
)

/* commands/sub/example/subcommand.ts */

export function run(ctx: CommandContext) {
    ctx.interaction.reply("Wow, you used the example subcommand!");
}

// Last example using subcommand group
// Similiar to using subcommands

export const example_using_group = createCommand(
    new SlashCommandBuilder()
    .setName("example")
    .setDescription("This is a example")
    .addSubcommandGroup((group) => {
        return group
        .setName("example_group")
        .setDescription("An example group of commands.")
        .addSubcommand((command) => {
            return command
            .setName("example_sub_of_group")
            .setDescription("An example subcommand that belongs to the parent group")
        })
    })
)

// The logic of the "example_sub_of_group" command will go in...
/* commands/example/example_group/example_sub_of_group.ts */
// The logic will be in the run function, RF: ln:34-39