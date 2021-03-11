import { Command } from 'discord.js-commando'

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      aliases: [],
      group: 'info',
      memberName: 'ping',
      description: 'Tests the connection to Discord.',
      guildOnly: true
    })
  }

  run (message) {
    return message.say(`pOng! \`${Math.floor(this.client.ws.ping)} ms\``)
  }
}

export default Ping
