import { SlashCommandBuilder } from '@discordjs/builders'
import D, { CommandInteraction, Guild } from 'discord.js'
import { client } from '../app'

const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Displays Scrambler bot stats.')
  .toJSON()

const formatTime = (time: number): string => {
  const date = new Date(time * 1000)
  const days = date.getUTCDate() - 1
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()
  const milliseconds = date.getUTCMilliseconds()

  if (days) {
    return `${days} day${days > 1 ? 's' : ''}`
  } else if (hours) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (minutes) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else if (hours) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else if (seconds) {
    return `${seconds} second${seconds > 1 ? 's' : ''}`
  } else if (milliseconds) {
    return `${milliseconds} ms`
  }
}

const run = async (interaction: CommandInteraction): Promise<void> => {
  const [guilds, channels, memory] = [0, 0, 0]
  const users = client.guilds.cache.toJSON().map((guild: Guild) => guild.memberCount).reduce((a, b) => a + b)
  const statsEmbed = new D.MessageEmbed()
    .setTitle('Bot Stats')
    .addField('Memory', `${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField('Uptime', formatTime(process.uptime()), true)
    .addField('Users', (users || client.users.cache.size).toLocaleString(), true)
    .addField('Guilds', (guilds || client.guilds.cache.size).toLocaleString(), true)
    .addField('Channels', (channels || client.channels.cache.size).toLocaleString(), true)
    .addField('Node.js', process.version, true)
    .addField('Discord.js', D.version, true)
    .setFooter('Scrambler', client.user.displayAvatarURL())
    .setColor('RANDOM')
    .setTimestamp()
  //  TODO: This is just for test purposes, the link needs updating.
  return interaction.reply({ embeds: [statsEmbed] })
}

export default { data, run }
