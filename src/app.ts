import Commando from 'discord.js-commando'
import * as settings from '../settings'
import path from 'path'
require('dotenv').config()

const client = new Commando.Client({
  commandPrefix: settings.prefix,
  owner: settings.owner,
  invite: 'https://discord.gg/bzKHzXc'
})

client.registry
  .registerGroups([
    ['generators', 'Scramble Generators'],
    ['competitions', 'Competitions'],
    ['relays', 'Multi-event Relays'],
    ['settings', 'Bot Configuration']
  ])
  .registerDefaults()
  .registerCommandsIn({
    filter: /^([^.].*)\.(js|ts)$/,
    dirname: path.join(__dirname, 'commands')
  })

console.log(__dirname)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
  client.user.setActivity('with Commando')
})

client.on('error', console.error)

client.login(process.env.TOKEN)
