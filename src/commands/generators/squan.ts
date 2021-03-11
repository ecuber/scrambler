import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: 'squan',
      aliases: ['squan', 'square-one', 'squareone', 'square-1', 'sq1', 'square1', 'sq-1'],
      group: 'generators',
      memberName: 'squan',
      description: 'Generates scrambles for square-1.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'args',
          type: 'string',
          prompt: 'Correct syntax: s!<sq1|squan> [# of scrambles]. For more help, see https://docs.scramblr.app/docs/scramblers/args',
          default: ''
        }
      ]
    })
  }

  run (message, { args }) {
    const params = args.split(' ')
    let count = parseInt(params[0])
    count = count ? count > 12 ? 12 : count < 0 ? undefined : count : undefined
    const scrambles = cube('sq1', count)
    let scrambleStr = ''
    for (let i = 0; i < scrambles.length; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }
    return message.say(scrambleStr)
  }
};

module.exports = Scramble
