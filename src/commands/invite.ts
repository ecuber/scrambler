import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Get the link to invite scrambler to your server.')
  .toJSON()

export const run = async (interaction: CommandInteraction): Promise<void> => {
  //  TODO: This is just for test purposes, the link needs updating.
  return interaction.reply('Scrambler can be invited here! :arrow_right: https://discordapp.com/oauth2/authorize?client_id=423530119836073986&permissions=130048&scope=bot')
}
