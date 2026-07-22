import { CommandInteraction, SlashCommandBuilder } from "discord.js";

declare interface ICommand {
    data: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export default ICommand;
