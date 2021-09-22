import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import cube from 'scrambler-util'

export const data = new SlashCommandBuilder()
  .setName('2x2')
  .setDescription('Generate a 2x2 scramble.')
  .addIntegerOption(option =>
    option.setName('count')
      .setDescription('Optional amount of scrambles to generate (1 - 12)')
  )
  .addStringOption(option =>
    option.setName('type')
      .setDescription('Add blindfolded rotations to the scramble.')
      .addChoice('bld', 'bld')
  ).toJSON()

export const help = {
  name: data.name,
  description: data.description,
  usage: '/2x2 <count>'
}

export const run = async (interaction: CommandInteraction): Promise<void> => {
  const type = interaction.options.get('type')?.value ?? false
  let count = interaction.options.get('count')?.value || 1
  count = Math.min(Math.abs(Number(count)), 12)

  const scrambles: string[] = cube('222', count, type)
  let scrambleStr = ''
  for (let i = 0; i < count; i++) {
    scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
  }

  return await interaction.reply(scrambleStr)
}
