import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import cube from 'scrambler-util'

export const data = new SlashCommandBuilder()
  .setName('2x2')
  .setDescription('Generates 1-12 2x2 scrambles.')
  .addIntegerOption(option =>
    option.setName('count')
      .setDescription('How many scrambles to generate (default 1)')
  )
  .addBooleanOption(option =>
    option.setName('bld')
      .setDescription('Whether to add blindfolded rotations to the end of the scramble(s)')
  ).toJSON()

export const help = {
  name: data.name,
  description: data.description,
  usage: '/2x2 <scramble count>'
}

export const run = async (interaction: CommandInteraction): Promise<void> => {
  const count = interaction.options.get('count')?.value ?? 1
  const bld = interaction.options.get('bld')?.value ?? false
  const bounded = count < 1 ? 1 : count > 12 ? 12 : count
  const scrambles: string[] = cube('222', bounded, bld ? 'bld' : null)
  let scrambleStr = ''
  for (let i = 0; i < scrambles.length; i++) {
    scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
  }
  return await interaction.reply(scrambleStr)
}
