import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'
import { Event, getEvents, countScrambles, getEvent } from '../../util/comp-util'

const usageString = 'Correct syntax: s!config [enable|disable|mode] [wca|single]. For more help, see https://docs.scramblr.app/docs/util/config'

const commands = ['enable', 'disable', 'mode', 'view', 'edit'] as const
type Option = typeof commands[number]

type Events = Array<{
  name: Event
  enabled: boolean
  count: number
}>

interface CompConfig {
  running: boolean
  enabled: boolean
  wca: boolean
  events: Events
}

interface Args {
  type: Option
  mode: 'wca' | 'single' | 'event' | 'count' | ''
  args: string[]
}

const defaultEvents = getEvents().map((name: Event) => {
  return {
    name,
    enabled: true,
    count: countScrambles(name)
  }
})

const getConfig = (msg: CommandoMessage): CompConfig => msg.guild.settings.get('comp', { enabled: true, running: false, wca: true, events: defaultEvents })

class Config extends Command {
  constructor (client) {
    super(client, {
      name: 'config',
      aliases: ['settings'],
      group: 'settings',
      memberName: 'config',
      description: 'Enables/disables competitions or sets the submission mode.',
      guildOnly: true,
      defaultHandling: false,
      args: [
        {
          key: 'type',
          type: 'string',
          oneOf: [...commands],
          prompt: usageString,
          default: 'view'
        },
        {
          key: 'mode',
          type: 'string',
          oneOf: ['wca', 'single', 'event', 'count', ''],
          prompt: usageString,
          default: ['']
        },
        {
          key: 'args',
          type: 'string',
          prompt: usageString,
          default: [''],
          infinite: true
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: Args): Promise<Message> {
    const config = getConfig(msg)
    if (config.running) {
      return await msg.reply('You can\'t edit the configuration right now because there\'s a competition running!')
    }
    return await this[args.type](msg, args, config)
  }

  async enable (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    if (!config.enabled) {
      await msg.guild.settings.set('comp', { ...config, enabled: !config.enabled })
    }
    return await msg.say('Competitions have successfully been enabled.')
  }

  async disable (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    if (config.enabled) {
      await msg.guild.settings.set('comp', { ...config, enabled: !config.enabled })
    }
    return await msg.say('Competitions have successfully been disabled.')
  }

  async mode (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    if (['wca', 'single'].includes(args.mode)) {
      await msg.guild.settings.set('comp', { ...config, wca: args.mode === 'wca' })
    } else {
      return msg.say(`Your submission mode is set to \`${config.wca ? 'WCA' : 'single'}\`.`)
    }
    return msg.say('Successfully updated your submission mode.')
  }

  /*
   * INFO ABOUT ARGUMENTS
   * args.args is a string array that will have all the command arguments that are relevant
   * to these subcommands.
   *
   * Read "Argument structure" section of  issue #12 (https://github.com/ecuber/scrambler/issues/12)
   */
  async edit (msg: CommandoMessage, { mode, args }: Args, config: CompConfig): Promise<Message> {
    const { events, running } = config
    if (!running) {
      if (mode === 'event') {
        if (args.length > 0) {
          const validEvents = args.map(toToggle => {
            const casted: Event = toToggle as any
            let eventName = null
            try {
              eventName = getEvent(casted)
            } catch (e: any) {
              // the event is not a valid event name or alias
            }
            return eventName
          }).filter(e => e !== null)

          const enabled = []
          const disabled = []

          if (validEvents.length > 0) {
            const updated = events.map(e => {
              if (validEvents.includes(e.name)) {
                if (e.enabled) {
                  disabled.push(e.name)
                } else {
                  enabled.push(e.name)
                }
                return { ...e, enabled: !e.enabled }
              }
              return e
            })
            await msg.guild.settings.set('comp', { ...config, events: updated })
            const eExists = enabled.length > 0
            const dExists = disabled.length > 0
            const and = enabled.length > 0 && disabled.length > 0 ? 'and ' : ''
            return await msg.say(`
              Successfully ${eExists ? `enabled ${enabled.join(', ')}` : ''}${and}${dExists ? `disabled ${disabled.join(', ')}` : ''}.
            `)
          } else {
            return await msg.say('None of the event names you specified were valid... make sure you spelled them correctly!')
          }
        }
      } else if (mode === 'count') {
        if (args.length === 2) {
          const casted: Event = args[0] as any
        } else {
          return await msg.say('The correct syntax for this command is `s!config edit count <event name> <scramble count>`')
        }
      }
    } else {
      return await msg.say('You can\'t change event settings while a competition is running!')
    }
  }

  async view (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    return await msg.say(new MessageEmbed()
      .setTitle('Competition Configuration')
      .addField('Enabled', config.enabled ? 'Yes' : 'No', true)
      .addField('Submission Type', config.wca ? 'WCA' : 'Single solve', true)
      .setFooter('Scrambler', this.client.user.displayAvatarURL())
      .setColor('RANDOM')
      .setTimestamp())
  }
}

export default Config
