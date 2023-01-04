import { SlashCommandBuilder } from '@discordjs/builders'
import D, { CommandInteraction } from 'discord.js'
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
  const memory = 0

  const promises = [
    client.shard.fetchClientValues('guilds.cache.size'),
    client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0))
  ]

  return Promise.all(promises)
    .then(async (values) => {
      const guilds = (values[0] as number[]).reduce((acc, guildCount) => acc + guildCount, 0)
      const users = (values[1] as number[]).reduce((acc, memberCount) => acc + memberCount, 0)
      const channels = (values[2] as number[]).reduce((acc, channelCount) => acc + channelCount, 0)
      const statsEmbed = new D.MessageEmbed()
        .setTitle('Bot Stats')
        .addField('Memory', `${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField('Uptime', formatTime(process.uptime()), true)
        .addField('Users', users.toLocaleString(), true)
        .addField('Guilds', guilds.toLocaleString(), true)
        .addField('Shards', client.shard.count.toLocaleString(), true)
        .addField('Channels', (channels).toLocaleString(), true)
        .addField('Node.js', process.version, true)
        .addField('Discord.js', D.version, true)
        .setFooter('Scrambler', client.user.displayAvatarURL())
        .setColor('RANDOM')
        .setTimestamp()
      return interaction.reply({ embeds: [statsEmbed] })
    })
}

export default { data, run }
