import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: '2-4',
      aliases: ['24', 'smallcubes', 'small-cubes'],
      group: 'relays',
      memberName: '2-4',
      description: 'Generates a set of scrambles for a 2x2-4x4 relay.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      },
      args: []
    })
  }

  run (message, { args }) {
    return message.say('Loading scrambles, please wait.').then(m => {
      const types = ['222', '333', '444']
      const scrambles = types.map(type => cube(type)[0])
      let scrambleStr = ''
      for (let i = 0; i < scrambles.length; i++) { scrambleStr += `**${i + 2}x${i + 2}**: ${scrambles[i]}\n\n` }
      return m.edit(scrambleStr)
    })
  }
};

module.exports = Scramble
