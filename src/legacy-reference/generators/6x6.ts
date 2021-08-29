import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: '6x6',
      aliases: ['six-by-six', '6x6x6', '6'],
      group: 'generators',
      memberName: '6x6',
      description: 'Generates scrambles for 6x6.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'args',
          type: 'string',
          prompt: 'Correct syntax: s!6x6 [# of scrambles]. For more help, see https://docs.scramblr.app/docs/scramblers/args',
          default: ''
        }
      ]
    })
  }

  run (message, { args }) {
    const params = args.split(' ')
    let count = parseInt(params[0])
    count = count ? count > 5 ? 5 : count < 0 ? undefined : count : undefined
    const scrambles = cube('666', count)
    let scrambleStr = ''
    for (let i = 0; i < scrambles.length; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }
    return message.say(scrambleStr)
  }
};

module.exports = Scramble
