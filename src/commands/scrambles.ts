import { SlashCommandBuilder } from '@discordjs/builders'
import D, { CommandInteraction } from 'discord.js'
import { commands } from '../app'

const data = new SlashCommandBuilder()
  .setName('scrambles')
  .setDescription('Sends a list of available commands.')
  .toJSON()

const filtered = ['invite', 'scrambles', 'stats']

const run = async (interaction: CommandInteraction): Promise<void> => {
  const cmdsEmbed = new D.MessageEmbed()
    .setDescription('Scrambler supports scrambles for the following events:')
  commands.forEach(cmd => {
    const { name, description } = cmd.data
    if (!filtered.includes(name)) {
      cmdsEmbed.addField(name, description)
    }
  })
  return interaction.reply({ embeds: [cmdsEmbed] })
}

export default { data, run }
