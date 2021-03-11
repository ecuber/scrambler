import Commando from 'discord.js-commando'
import { MongoClient } from 'mongodb'
import { MongoDBProvider } from 'commando-provider-mongo'
import * as settings from '../settings'
import path from 'path'
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
  return blockedChannels?.includes(msg.channel.id) ? 'channel blocked' : false
})

// Fires on ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
  client.user.setActivity(`Scrambling cubes for ${client.guilds.cache.size} servers!`)
})

client.on('error', console.error)

client.login(process.env.TOKEN)
