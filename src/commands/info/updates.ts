import { Command, CommandoMessage } from 'discord.js-commando'
import { MessageEmbed } from 'discord.js'

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'updates',
      aliases: ['whatsnew', 'new'],
      group: 'info',
      memberName: 'updates',
      description: 'Summary of bot updates.',
      guildOnly: true
    })
  }

  run (message: CommandoMessage): Promise<CommandoMessage> {
    return message.say(new MessageEmbed()
      .setTitle('v3.0.0 Released!')
      .setColor('RANDOM')
      .setDescription('Scrambler has been rewritten again to address the previous ')
      .addField('What\'s new?', 'In late February, you likely noticed a bug where podiums sent completely incorrectly. This occurred due to an issue with Klasa, a discontinued framework we previously used. The bot has been rewritten **[support server](https://discord.gg/vdxGtKK)**! Thanks for sticking around and using scrambler.\n-ecuber#0566 (developer)')
      .setTimestamp()
      .setFooter('Scrambler', this.client.user.displayAvatarURL()))
  }
}

export default Ping
