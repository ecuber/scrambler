import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: '4x4',
      aliases: ['four-by-four', '4x4x4', '4'],
      group: 'generators',
      memberName: '4x4',
      description: 'Generates scrambles for 4x4 or 4BLD.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      },
      args: [
        {
          key: 'args',
          type: 'string',
          prompt: 'Correct syntax: s!4x4 [bld] [# of scrambles]. For more help, see https://docs.scramblr.app/docs/scramblers/args',
          default: ''
        }
      ]
    })
  }

  async run (message, { args }) {
    const params = args.split(' ')
    const bld = params[0] === 'bld'
    let count = parseInt(bld ? params[1] : params[0])
    let scrambleStr = ''
    count = count ? count > 12 ? 12 : count < 0 ? 1 : count : 1
    return await message.say('Loading scrambles...').then(m => {
      const scrambles = cube('444', count, bld ? 'bld' : null)
      for (let i = 0; i < scrambles.length; i++) { scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n` }
      m.edit(scrambleStr)
    })
  }
};

module.exports = Scramble
