import { Message } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

const usageString = 'Correct syntax: s!comp <start|end> [#channel]. For more help, see https://docs.scramblr.app/docs/comps'

const commands = ['start', 'end'] as const
type Option = typeof commands[number]

class Comp extends Command {
  constructor (client) {
    super(client, {
      name: 'comp',
      aliases: ['competition'],
      group: 'competitions',
      memberName: 'comp',
      description: 'Starts/ends competitiions.',
      guildOnly: true,
      args: [
        {
          key: 'type',
          type: 'string',
          oneOf: [...commands],
          prompt: usageString,
          default: 'start'
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: { type: Option }): Promise<Message> {
    return await this[args.type](msg)
  }

  async start (msg: CommandoMessage): Promise<Message> {
    // Check if server has competition running
    // If yes, cancel

    // Find enabled events
    // Send scrambles formatted
    // Set competition status to running
    // Report successfully started competition
    return msg.say('work in progress')
  }

  async end (msg: CommandoMessage): Promise<Message> {
    // Check if server has competition running
    // If no, cancel

    // Prompt user if they are sure they want to end the comp
    // Get results from DB
    // Iterate through events and calculate winners
    // Delete results from database
    // Post podiums
    return msg.say('work in progress')
  }
}

export default Comp
