import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: '5-7',
      aliases: ['57', 'bigcubes', 'big', 'big-cubes'],
      group: 'relays',
      memberName: '5-7',
      description: 'Generates a set of scrambles for a 5x5-7x7 relay.',
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
      const types = ['555', '666', '777']
      const scrambles = types.map(type => cube(type)[0])
      let scrambleStr = ''
      for (let i = 0; i < scrambles.length; i++) { scrambleStr += `**${i + 5}x${i + 5}**: ${scrambles[i]}\n\n` }
      return m.edit(scrambleStr)
    })
  }
};

module.exports = Scramble
