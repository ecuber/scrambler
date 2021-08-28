import { Message, Role, User } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

const usageString = 'Correct syntax: s!unban [all|reset] [@member|@role] [...]. For more help, see https://docs.scramblr.app/docs/util/ban'

class Ban extends Command {
  constructor (client) {
    super(client, {
      name: 'unban',
      aliases: ['unbans', 'pardon'],
      group: 'settings',
      memberName: 'unban',
      description: 'Bans users from competitions.',
      guildOnly: true,
      args: [
        {
          key: 'args',
          type: 'role|user',
          prompt: usageString,
          infinite: true,
          default: ['view']
        }
      ]
    })
  }

  async run (msg: CommandoMessage, { args }: { args: any[] }): Promise<Message> {
    if (['reset', 'all'].includes(args[0])) {
      return await this.reset(msg)
    }
    return await this.unban(msg, args)
  }

  async unban (msg: CommandoMessage, args: any[]): Promise<Message> {
    if (args) {
      const roles: string[] = msg.guild.settings.get('banned.roles', [])
      const users: string[] = msg.guild.settings.get('banned.users', [])
      const unusable: any[] = []
      args.forEach(a => {
        if (a instanceof Role && roles.includes(a.id)) {
          roles.splice(roles.indexOf(a.id), 1)
        } else if (a instanceof User && users.includes(a.id)) {
          users.splice(users.indexOf(a.id), 1)
        } else {
          unusable.push(a)
        }
      })
      const used = args.filter(v => !unusable.includes(v))
      await msg.guild.settings.set('banned.roles', roles)
      await msg.guild.settings.set('banned.users', users)
      if (used.length > 0) {
        return await msg.say('Successfully updated your ban list!')
      } else {
        return await msg.say('You didn\'t specify any valid users or roles, the ones you entered are already on the ban list.')
      }
    }
  }

  async reset (msg: CommandoMessage): Promise<Message> {
    await msg.guild.settings.remove('banned.roles')
    await msg.guild.settings.remove('banned.users')
    return msg.say('You have cleared the banned user and banned role lists.')
  }
}

export default Ban
