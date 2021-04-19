import { Command, CommandoMessage, version } from 'discord.js-commando'
import D from 'discord.js'

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

class Stats extends Command {
  constructor (client) {
    super(client, {
      name: 'stats',
      aliases: [],
      group: 'info',
      memberName: 'stats',
      description: 'Provides Scrambler\'s bot statistics.',
      guildOnly: true
    })
  }

  async run (message: CommandoMessage): Promise<CommandoMessage> {
    const [users, guilds, channels, memory] = [0, 0, 0, 0]
    return message.say(new D.MessageEmbed()
      .setTitle('Bot Stats')
      .addField('Memory', `${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .addField('Uptime', formatTime(process.uptime()), true)
      .addField('Users', (users || this.client.users.cache.size).toLocaleString(), true)
      .addField('Guilds', (guilds || this.client.guilds.cache.size).toLocaleString(), true)
      .addField('Channels', (channels || this.client.channels.cache.size).toLocaleString(), true)
      .addField('Node.js', process.version, true)
      .addField('Discord.js', D.version, true)
      .addField('Commando', version, true)
      .setFooter('Scrambler', this.client.user.displayAvatarURL())
      .setColor('RANDOM')
      .setTimestamp())
  }
}

export default Stats
