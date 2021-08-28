import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: 'mega',
      aliases: ['megaminx'],
      group: 'generators',
      memberName: 'mega',
      description: 'Generates scrambles for megaminx.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: 'args',
          type: 'string',
          prompt: 'Correct syntax: s!mega [# of scrambles]. For more help, see https://docs.scramblr.app/docs/scramblers/args',
          default: ''
        }
      ]
    })
  }

  run (message, { args }) {
    const params = args.split(' ')
    let count = parseInt(params[0])
    count = count ? count > 5 ? 5 : count < 0 ? undefined : count : undefined
    const scrambles = cube('mega', count)
    let scrambleStr = ''
    for (let i = 0; i < scrambles.length; i++) {
      scrambleStr += `${count > 1 ? `${i + 1}: ` : ''}${scrambles[i]}\n\n`
    }
    return message.say(scrambleStr)
  }
};

module.exports = Scramble
