import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import cube from 'scrambler-util'

export default (name: string, max: number, bld: string, fmc: string, fullName: string = name): object => {
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
    ).toJSON()
  } else if (bld) {
    data.addStringOption(option =>
      option.setName('type')
        .setDescription('Add blindfolded rotations to the scramble.')
        .addChoice(bld, bld)
    ).toJSON()
  }

  const run = async (interaction: CommandInteraction): Promise<void> => {
    const type = interaction.options.get('type')?.value ?? false
    let count = interaction.options.get('count')?.value || 1
    count = Math.min(Math.abs(Number(count)), max)

    let parsedName = fullName.replace(/x/g, '')
    parsedName = fullName.charAt(1) === 'x' ? parsedName.length === 2 ? parsedName + parsedName.slice(-1) : parsedName : name

    const scrambles: string[] = cube(parsedName, count, type)
    let scrambleStr = ''
    for (let i = 0; i < count; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }

    return await interaction.reply(scrambleStr)
  }

  return { data, run }
}
