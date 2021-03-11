import { TextChannel } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

const usageString = 'Correct syntax: s!ignore [reset|toggle|all|view] [#channel] [...]. For more help, see https://docs.scramblr.app/docs/util/ignore'

function buildStr (ignored: TextChannel[], unignored: TextChannel[]) {
  let on, off
  if (ignored.length > 0) { on = `will now ignore commands in ${ignored.join(', ')}` }
  if (unignored.length > 0) { off = `will no longer ignore commands in ${unignored.join(', ')}` }
  return `Scrambler${on ? ` ${on}` : ''}${on && off ? ' and' : ''}${off ? ` ${off}` : ''}.`
};

class Ignore extends Command {
  constructor (client) {
    super(client, {
      name: 'ignore',
      aliases: ['restrict'],
      group: 'settings',
      memberName: 'ignore',
      description: 'Manages your ignored channels.',
      guildOnly: true,
      args: [
        {
          key: 'type',
          type: 'string',
          oneOf: ['reset', 'all', 'view', 'toggle'],
          prompt: usageString,
          default: 'toggle'
        },
        {
          key: 'channels',
          type: 'channel',
          infinite: true,
          prompt: usageString,
          default: ''
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: { type: string, channels: TextChannel[] }) {
    return await this[args.type](msg, args)
  }

  async view (msg: CommandoMessage, args: { type: string, channels: TextChannel[] }) {
    const channels: string[] = msg.guild.settings.get('ignored')
    if (channels?.length > 0) {
      return msg.say(`Scrambler is currently ignoring commands in the following channels: ${channels.map(c => `<#${c}>`).join(', ')}`)
    } else {
      return msg.say('Scrambler is not ignoring any channels.')
    }
  }

  async toggle (msg: CommandoMessage, { channels }: { type: string, channels: TextChannel[] }) {
    const settings: string[] = msg.guild.settings.get('ignored')
    const ignored: TextChannel[] = []
    const unignored: TextChannel[] = []

    if (channels?.length < 1) { return msg.say(`You didn't specify any channels! ${usageString}`) }

    channels.forEach(channel => {
      const channelIndex = settings?.indexOf(channel.id)
      if (channelIndex !== -1) {
        settings.splice(channelIndex, 1)
        unignored.push(channel)
      } else {
        settings.push(channel.id)
        ignored.push(channel)
      }
    })
    await msg.guild.settings.set('ignored', settings)
    return msg.say(`Successfully updated your settings! ${buildStr(ignored, unignored)}`)
  }

  all (msg: CommandoMessage, { channels }: { type: string, channels: TextChannel[] }) {
    const ids = channels.length > 0 ? channels.map(channel => channel.id) : []
    const guildChannels = msg.guild.channels.cache.filter(channel => channel instanceof TextChannel && !ids.includes(channel.id))
    msg.guild.settings.set('ignored', guildChannels.map(channel => channel.id))
    return msg.say(`Successfully updated your settings! All channels will be ignored${channels.length > 0 ? ` except ${channels.join(', ')}.` : '.'}`)
  }

  reset (msg: CommandoMessage, args: { type: string, channels: TextChannel[] }) {
    msg.guild.settings.remove('ignored')
    return msg.say('Successfully updated your settings! Scrambler is now enabled in all channels.')
  }
}

export default Ignore
