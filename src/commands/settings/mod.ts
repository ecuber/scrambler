import { Message, Role } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

const usageString = 'Correct syntax: s!ignore [view|add|remove|reset] [@role] [...]. For more help, see https://docs.scramblr.app/docs/util/config'

const commands = ['view', 'add', 'remove', 'reset'] as const
type Option = typeof commands[number]

class Mod extends Command {
  constructor (client) {
    super(client, {
      name: 'mod',
      aliases: ['moderator', 'mods', 'moderators'],
      group: 'settings',
      memberName: 'mod',
      description: 'Manages your Scrambler moderators.',
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
          key: 'roles',
          type: 'role',
          infinite: true,
          prompt: usageString,
          default: ['']
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: { type: Option, roles: Role[] }): Promise<Message> {
    return await this[args.type](msg, args)
  }

  async view (msg: CommandoMessage): Promise<Message> {
    const roles: string[] = msg.guild.settings.get('modRoles', [])
    if (roles?.length > 0) {
      return msg.say(`The following roles currently have moderator permissions: ${roles.map(c => msg.guild.roles.cache.get(c)).join(', ')}`)
    } else {
      return msg.say('You haven\'t set any moderator roles.')
    }
  }

  async add (msg: CommandoMessage, args: { roles: Role[]}): Promise<Message> {
    if (args.roles?.length > 0) {
      const clone: string[] = msg.guild.settings.get('modRoles', [])
      args.roles.forEach(role => {
        if (!clone.includes(role.id)) {
          clone.push(role.id)
        }
      })
      await msg.guild.settings.set('modRoles', clone)
      return msg.say(`Successfully updated your settings! Added ${args.roles.join(', ')}.`)
    }
    return msg.say('You didn\'t specify any roles, so no changes will be made.')
  }

  async remove (msg: CommandoMessage, args: { roles: Role[] }): Promise<Message> {
    const removed: string[] = []
    if (args.roles?.length > 0) {
      const current: string[] = msg.guild.settings.get('modRoles', [])
      if (current.length !== 0) {
        args.roles.forEach(role => {
          if (current.includes(role.id)) {
            removed.push(...current.splice(current.indexOf(role.id), 1))
          }
        })
      }
    } else {
      return msg.say('You didn\'t specify any roles, so no changes will be made.')
    }

    return msg.say(
      removed.length > 0
        ? `Successfully updated your settings! Removed ${removed.map(r => msg.guild.roles.cache.get(r)).join(', ')}.`
        : 'You haven\'t set any moderator roles yet, so no changes were made.'
    )
  }

  async reset (msg: CommandoMessage, args: { type: string, roles: Role[] }): Promise<Message> {
    await msg.guild.settings.remove('modRoles')
    return msg.say('You have removed all moderator roles.')
  }
}

export default Mod
