import { Message } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'
import { Event, allEvents } from '../../util/comp-util'

const usageString = 'Correct syntax: s!submit <event> <results> For more help, see https://docs.scramblr.app/docs/comps/submit'

class Submit extends Command {
  constructor (client) {
    super(client, {
      name: 'submit',
      group: 'competitions',
      memberName: 'ignore',
      description: 'Manages your ignored channels.',
      guildOnly: true,
      args: [
        {
          key: 'event',
          type: 'string',
          oneOf: [...allEvents],
          prompt: usageString
        },
        {
          key: 'results',
          type: 'float',
          infinite: true,
          prompt: usageString
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: { event: Event, results: number[] }): Promise<Message> {
    // Make sure competition is running
    // args.event should be a valid event name
    // use comp-util #getEvent to convert the alias to a top-level event name
    // Make sure the event is enabled in the current competition
    return await msg.say('submit in progress')
  }
}

export default Submit
