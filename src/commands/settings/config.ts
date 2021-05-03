import { Message, MessageEmbed } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'
import { Event } from '../../util/comp-util'

const usageString = 'Correct syntax: s!config [enable|disable|mode] [wca|single]. For more help, see https://docs.scramblr.app/docs/util/config'

const commands = ['enable', 'disable', 'mode', 'view'] as const
type Option = typeof commands[number]

interface CompConfig {
  running: boolean
  enabled: boolean
  wca: boolean
}

interface Args {
  type: Option
  mode: 'wca' | 'single' | 'event' | 'count' | ''
  args: string[]
}

const getConfig = (msg: CommandoMessage): CompConfig => msg.guild.settings.get('comp', { enabled: true, wca: true })

class Config extends Command {
  constructor (client) {
    super(client, {
      name: 'config',
      aliases: ['settings'],
      group: 'settings',
      memberName: 'config',
      description: 'Enables/disables competitions or sets the submission mode.',
      guildOnly: true,
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
      msg.guild.settings.set('comp', { ...config, enabled: !config.enabled })
    }
    return await msg.say('Competitions have successfully been enabled.')
  }

  async disable (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    if (config.enabled) {
      msg.guild.settings.set('comp', { ...config, enabled: !config.enabled })
    }
    return await msg.say('Competitions have successfully been disabled.')
  }

  async mode (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    if (args.mode !== '') {
      msg.guild.settings.set('comp', { ...config, wca: args.mode === 'wca' })
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
  async event (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    return await msg.say('in progress')
  }

  async count (msg: CommandoMessage, args: Args, config: CompConfig): Promise<Message> {
    return await msg.say('in progress')
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
