import { Message, MessageEmbed, Role, User } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

const usageString = 'Correct syntax: s!ban [view|reset] [@member|@role] [...]. For more help, see https://docs.scramblr.app/docs/util/ban'

class Ban extends Command {
  constructor (client) {
    super(client, {
      name: 'ban',
      aliases: ['bans', 'block'],
      group: 'settings',
      memberName: 'ban',
      description: 'Bans users from competitions.',
      guildOnly: true,
      args: [
        {
          key: 'args',
          type: 'role|user|string',
          prompt: usageString,
          infinite: true,
          default: ['view']
        }
      ]
    })
  }

  async run (msg: CommandoMessage, { args }: { args: any[] }): Promise<Message> {
    if (args[0] === 'view') {
      return await this.view(msg)
    } else if (args[0] === 'reset') {
      return await this.reset(msg)
    }
    return await this.ban(msg, args)
  }

  async view (msg: CommandoMessage): Promise<Message> {
    const roles: string[] = msg.guild.settings.get('banned.roles', [])
    const users: string[] = msg.guild.settings.get('banned.users', [])
    if (users?.length > 0 || roles?.length > 0) {
      const embed = new MessageEmbed().setTitle('Ban List').setTimestamp().setColor('RANDOM').setFooter(this.client.user.username, this.client.user.avatarURL())
      if (users.length > 0) {
        const strings: string[] = []
        users.forEach(u => {
          const mem = msg.guild.members.cache.get(u)
          if (mem) {
            strings.push(`${mem.user.username}#${mem.user.discriminator}`)
          } else {
            strings.push(`Inactive user - ID: ${u}`)
          }
        })
        embed.addField('Users', strings.map(u => `- ${u}`))
      }
      if (roles.length > 0) {
        embed.addField('Roles', roles.map(c => `<@&${c}>`).map(u => `- ${u}`))
      }
      return msg.say(embed)
    } else {
      return msg.say('You haven\'t banned anyone.')
    }
  }

  async ban (msg: CommandoMessage, args: any[]): Promise<Message> {
    if (args) {
      const roles: string[] = msg.guild.settings.get('banned.roles', [])
      const users: string[] = msg.guild.settings.get('banned.users', [])
      const unusable: any[] = []
      args.forEach(a => {
        if (a instanceof Role && !roles.includes(a.id)) {
          roles.push(a.id)
        } else if (a instanceof User && !users.includes(a.id)) {
          users.push(a.id)
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
