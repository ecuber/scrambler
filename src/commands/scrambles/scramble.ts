import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import cube from 'scrambler-util'
import { CommandData, trackCmd } from '../../app'

export default (name: string, max: number, bld: string, fmc: string, fullName: string = name): { data: CommandData, run: (interaction: CommandInteraction) => Promise<void> } => {
  const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription(`Generate a ${fullName} scramble.`)
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription(`Optional amount of scrambles to generate (1 - ${max})`)
    )

  if (fmc) {
    data.addStringOption(option =>
      option.setName('type')
        .setDescription('Add blindfolded rotations to the scramble, or make a fewest moves challenge.')
        .addChoice(bld, bld)
        .addChoice(fmc, fmc)
    )
  } else if (bld) {
    data.addStringOption(option =>
      option.setName('type')
        .setDescription('Add blindfolded rotations to the scramble.')
        .addChoice(bld, bld)
    )
  }

  const run = async (interaction: CommandInteraction): Promise<void> => {
    const type = interaction.options.get('type')?.value ?? false
    let count = interaction.options.get('count')?.value || 1
    count = Math.min(Math.abs(Number(count)), max)

    let parsedName = fullName.replace(/x/g, '')
    parsedName = fullName.charAt(1) === 'x' ? parsedName.length === 2 ? parsedName + parsedName.slice(-1) : parsedName : name

    if (name === '4x4') {
      await interaction.reply('Preparing scrambles... (this may take a moment)')
    }

    const scrambles: string[] = cube(parsedName, count, type)
    let scrambleStr = ''
    for (let i = 0; i < count; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }

    if (name === '4x4') {
      await interaction.editReply(scrambleStr)
      return
    }
    await interaction.reply(scrambleStr)
    await trackCmd(name, interaction.guild)
  }

  return { data: data.toJSON(), run }
}
