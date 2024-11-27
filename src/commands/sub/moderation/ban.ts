import { CommandContext } from "../../../internal/helpers";

export async function run(ctx: CommandContext) {
    await ctx.interaction.deferReply();
    //TODO: Add logic, i forgor.
}