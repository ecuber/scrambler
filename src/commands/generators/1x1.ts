import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: '1x1',
      aliases: ['one-by-one', '1x1x1', '1'],
      group: 'generators',
      memberName: '1x1',
      description: 'Generates scrambles for 1x1 or 1BLD.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'args',
          type: 'string',
          prompt: 'Correct syntax: s!1x1 [bld] [# of scrambles]. For more help, see https://docs.scramblr.app/docs/scramblers/args',
          default: ''
        }
      ]
    })
  }

  run (message, { args }) {
    const params = args.split(' ')
    const bld = params[0] === 'bld'
    let count = parseInt(bld ? params[1] : params[0])
    count = count ? count > 12 ? 12 : count < 0 ? undefined : count : undefined
    const scrambles = cube('111', count, bld ? params[0] : null)
    let scrambleStr = ''
    for (let i = 0; i < scrambles.length; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }
    return message.say(scrambleStr)
  }
};

module.exports = Scramble
