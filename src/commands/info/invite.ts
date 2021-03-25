import { Command } from 'discord.js-commando'

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      aliases: [],
      group: 'info',
      memberName: 'invite',
      description: 'Gives information for inviting Scrambler.',
      guildOnly: true
    })
  }

  run (message) {
    return message.say('Scrambler can be invited here! :arrow_right: https://discordapp.com/oauth2/authorize?client_id=423530119836073986&permissions=130048&scope=bot')
  }
}

export default Ping
