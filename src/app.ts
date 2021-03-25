import Commando from 'discord.js-commando'
import { MongoClient } from 'mongodb'
import { MongoDBProvider } from 'commando-provider-mongo'
import * as settings from '../settings'
import path from 'path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const client = new Commando.Client({
  commandPrefix: settings.prefix,
  owner: settings.owner,
  invite: 'https://discord.gg/bzKHzXc'
})

// Client command registry
client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({
    ping: false,
    unknownCommand: false,
    prefix: false
  })
  .registerGroups([
    ['generators', 'Scramble Generators'],
    ['competitions', 'Competitions'],
    ['relays', 'Multi-event Relays'],
    ['settings', 'Bot Configuration'],
    ['info', 'Bot Information']
  ])
  .registerCommandsIn({
    filter: /^([^.].*)\.(js|ts)$/,
    dirname: path.join(__dirname, 'commands')
  })

// MongoDB provider automatically sets everything up
client.setProvider(
  MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true }).then(client => new MongoDBProvider(client, 'Scrambler'))
).catch(console.error)

// Inhibitor for ignored channels
client.dispatcher.addInhibitor(msg => {
  const blockedChannels: string[] = msg.guild.settings.get('ignored')
  return blockedChannels?.includes(msg.channel.id) && msg.command.name !== 'ignore' ? 'channel blocked' : false
})

const adminCommands = ['ignore', 'mod', 'op', 'config', 'prefix']
client.dispatcher.addInhibitor(msg => {
  if (msg.command === null) { return false }
  const mods: string[] = msg.guild.settings.get('modRoles')
  const ops: string[] = msg.guild.settings.get('ops')
  const authorRoles = msg.member.roles.cache.map(role => role.id)
  let isMod = false
  if (mods !== undefined) {
    mods.forEach(role => {
      if (authorRoles.includes(role)) {
        isMod = true
      }
    })
  }
  isMod = isMod || msg.member.hasPermission('MANAGE_GUILD') || client.isOwner(msg.author) || ops.includes(msg.author.id)
  const result = adminCommands.includes(msg.command.memberName) && !isMod ? 'no perms' : false
  if (result === 'no perms') {
    msg.reply('You don\'t have permission to use this command!')
  }
  return result
})

// Fires on ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user?.id !== null ? client.user.id : 'none'})`)
  client.user?.setActivity(`Scrambling cubes for ${client.guilds.cache.size} servers!`)
})

client.on('error', console.error)

client.login(process.env.TOKEN)
