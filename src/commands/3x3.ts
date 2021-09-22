import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import cube from 'scrambler-util'

export const data = new SlashCommandBuilder()
  .setName('3x3')
  .setDescription('Generate a 3x3 scramble.')
  .addIntegerOption(option =>
    option.setName('count')
      .setDescription('Optional amount of scrambles to generate (1 - 12)')
  )
  .addStringOption(option =>
    option.setName('type')
      .setDescription('Make a fewest moves challenge, or add blindfolded rotations.')
      .addChoice('bld', 'bld')
      .addChoice('fmc', 'fmc')
  ).toJSON()

export const help = {
  name: data.name,
  description: data.description,
  usage: '/3x3 <count> <type: bld | fmc>'
}

export const run = async (interaction: CommandInteraction): Promise<void> => {
  const type = interaction.options.get('type')?.value ?? false
  let count = interaction.options.get('count')?.value || 1
  count = Math.min(Math.abs(Number(count)), 12)

  const scrambles: string[] = cube('333', count, type)
  let scrambleStr = ''
  for (let i = 0; i < count; i++) {
    scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
  }

  return await interaction.reply(scrambleStr)
}
