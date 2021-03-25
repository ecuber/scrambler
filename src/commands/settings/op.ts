import { Message, User } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

const usageString = 'Correct syntax: s!ignore [view|add|remove|reset] [@member] [...]. For more help, see https://docs.scramblr.app/docs/util/config'

const commands = ['view', 'add', 'remove', 'reset'] as const
type Option = typeof commands[number]

class Op extends Command {
  constructor (client) {
    super(client, {
      name: 'op',
      aliases: ['operator', 'ops', 'operators'],
      group: 'settings',
      memberName: 'op',
      description: 'Manages your Scrambler operators.',
      guildOnly: true,
      args: [
        {
          key: 'type',
          type: 'string',
          oneOf: ['view', 'add', 'remove', 'reset'],
          prompt: usageString,
          default: 'toggle'
        },
        {
          key: 'users',
          type: 'user',
          infinite: true,
          prompt: usageString,
          default: ['']
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: { type: Option, users: any }): Promise<Message> {
    return await this[args.type](msg, args)
  }

  async view (msg: CommandoMessage): Promise<Message> {
    const users: string[] = msg.guild.settings.get('ops', [])
    if (users?.length > 0) {
      return msg.say(`The following users have moderator permissions: ${users.map(c => msg.guild.members.cache.get(c)).map(u => `${u.user.username}#${u.user.discriminator}`).join(', ')}`)
    } else {
      return msg.say('You haven\'t set any moderator users.')
    }
  }

  async add (msg: CommandoMessage, args: { users: User[] }): Promise<Message> {
    if (args.users?.length > 0) {
      const clone: string[] = msg.guild.settings.get('ops', [])
      args.users.forEach(user => {
        if (!clone.includes(user.id)) {
          clone.push(user.id)
        }
      })
      await msg.guild.settings.set('ops', clone)
      return msg.say(`Successfully updated your settings! Added ${args.users.map(u => `${u.username}#${u.discriminator}`).join(', ')} as ${args.users.length > 1 ? 'moderators.' : 'a moderator.'}.`)
    }
    return msg.say('You didn\'t specify any users, so no changes will be made.')
  }

  async remove (msg: CommandoMessage, args: { users: User[] }): Promise<Message> {
    const removed: string[] = []
    if (args.users?.length > 0) {
      const current: string[] = msg.guild.settings.get('ops', [])
      if (current.length !== 0) {
        args.users.forEach(role => {
          if (current.includes(role.id)) {
            removed.push(...current.splice(current.indexOf(role.id), 1))
          }
        })
      }
    } else {
      return msg.say('You didn\'t specify any users, so no changes will be made.')
    }

    return msg.say(
      removed.length > 0
        ? `Successfully updated your settings! Removed ${removed.map(r => msg.guild.members.cache.get(r)).map(u => `${u.user.username}#${u.user.discriminator}`).join(', ')}.`
        : 'You haven\'t set any moderator users yet, so no changes were made.'
    )
  }

  async reset (msg: CommandoMessage, args: { type: string, users: User[] }): Promise<Message> {
    await msg.guild.settings.remove('ops')
    return msg.say('You have removed all moderator users.')
  }
}

export default Op
