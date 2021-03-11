import { Command } from 'discord.js-commando'
import cube from 'scrambler-util'

class Scramble extends Command {
  constructor (client) {
    super(client, {
      name: 'mini-guildford',
      aliases: ['mg', 'mini-guildford', 'miniguildford'],
      group: 'relays',
      memberName: 'mini',
      description: 'Generates a set of scrambles for a mini guildford relay.',
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
      const types = ['222', '333', '444', '555']
      let scrambles = types.map(type => cube(type)[0])
      let scrambleStr = ''
      for (let i = 0; i < scrambles.length; i++) { scrambleStr += `**${i + 2}x${i + 2}**: ${scrambles[i]}\n\n` }
      const labeled = [
        { name: '**OH**: ', type: '333' },
        { name: '**Clock**: ', type: 'clock' },
        { name: '**Pyraminx**: ', type: 'pyra' },
        { name: '**Skewb**: ', type: 'skewb' },
        { name: '**Square-1**: ', type: 'sq1' },
        { name: '**Megaminx**: ', type: 'mega' }]
      scrambles = labeled.map(type => `${type.name}${cube(type.type)[0]}`)
      scrambles.forEach(scramble => { scrambleStr += `${scramble}\n\n` })
      return m.edit(scrambleStr)
    })
  }
};

module.exports = Scramble
