import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: '5x5',
      aliases: ['five-by-five', '5x5x5', '5'],
      group: 'generators',
      memberName: '5x5',
      description: 'Generates scrambles for 5x5 or 5BLD.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'args',
          type: 'string',
          prompt: 'Correct syntax: s!5x5 [bld] [# of scrambles]. For more help, see https://docs.scramblr.app/docs/scramblers/args',
          default: ''
        }
      ]
    })
  }

  async run (message, { args }) {
    const params = args.split(' ')
    const bld = params[0] === 'bld'
    let count = parseInt(bld ? params[1] : params[0])
    count = count ? count > 12 ? 12 : count < 0 ? undefined : count : undefined
    const scrambles = cube('555', count, bld ? params[0] : null)
    let scrambleStr = ''
    for (let i = 0; i < scrambles.length; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }
    return message.say(scrambleStr)
  }
};

module.exports = Scramble
