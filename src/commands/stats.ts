import { SlashCommandBuilder } from '@discordjs/builders'
import D, { CommandInteraction, Guild } from 'discord.js'
import { ExtClient } from '../app'
// import { client } from '../app'

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
  const memory = 0

  const client: ExtClient = interaction.client

  const promises = [
    await client.cluster.fetchClientValues('guilds.cache.size'),
    await client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0)),
    await client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc: number, guild: Guild) => acc + guild.channels.cache.size, 0))
  ]

  const guilds = promises[0].reduce((acc: number, guildCount: number) => acc + guildCount, 0)
  const users = promises[1].reduce((acc: number, memberCount: number) => acc + memberCount, 0)
  const channels = promises[2].reduce((acc: number, channelCount: number) => acc + channelCount, 0)
  const statsEmbed = new D.MessageEmbed()
    .setTitle('Bot Stats')
    .addFields([
      { name: 'Memory', value: `${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
      { name: 'Uptime', value: formatTime(process.uptime()), inline: true },
      { name: 'Users', value: users.toLocaleString(), inline: true },
      { name: 'Guilds', value: guilds.toString(), inline: true },
      { name: 'Shards', value: client.cluster.count.toString(), inline: true },
      { name: 'Channels', value: channels.toString(), inline: true },
      { name: 'Node.js', value: process.version, inline: true },
      { name: 'Discord.js', value: D.version, inline: true }
    ])
    .setFooter({ text: 'Scrambler', iconURL: client.user.displayAvatarURL() })
    .setColor('RANDOM')
    .setTimestamp()
  return interaction.reply({ embeds: [statsEmbed] })
}

export default { data, run }
