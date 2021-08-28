/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { stripIndents, oneLine } from 'common-tags'
import { Message } from 'discord.js'
import { Command, CommandoMessage } from 'discord.js-commando'

class Prefix extends Command {
  constructor (client) {
    super(client, {
      name: 'prefix',
      group: 'util',
      memberName: 'prefix',
      description: 'Shows or sets the command prefix.',
      format: '[prefix/"default"/"none"]',
      details: oneLine`
        If no prefix is provided, the current prefix will be shown.
        If the prefix is "default", the prefix will be reset to the bot's default prefix.
        If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
        Only administrators may change the prefix.
      `,
      examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],
      guildOnly: true,
      args: [
        {
          key: 'prefix',
          prompt: 'What would you like to set the bot\'s prefix to?',
          type: 'string',
          max: 15,
          default: ''
        }
      ]
    })
  }

  async run (msg: CommandoMessage, args: { prefix: string }): Promise<Message> {
    if (!args.prefix) {
      const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix
      return await msg.say(stripIndents`
        ${prefix ? `Your prefix is currently set to \`${prefix}\`.` : 'There is no command prefix.'} To change it, use ${msg.anyUsage('prefix <new prefix>')}.
      `)
    }

    // Save the prefix
    const lowercase = args.prefix.toLowerCase()
    const prefix = lowercase === 'none' ? '' : args.prefix
    let response: string
    if (lowercase === 'reset') {
      if (msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null
      const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'no prefix'
      response = `Reset the command prefix to the default (currently ${current}).`
    } else {
      if (msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix
      response = prefix ? `Set the command prefix to \`${args.prefix}\`.` : 'Removed the command prefix entirely.'
    }

    await msg.say(`${response} To run commands, use ${msg.anyUsage('<command>')}.`)
    return null
  }
}

export default Prefix
