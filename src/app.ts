/* eslint-disable @typescript-eslint/no-var-requires */
// import { MongoClient } from 'mongodb'
// import { MongoDBProvider } from 'commando-provider-mongo'
import * as settings from '../settings'
import { REST } from '@discordjs/rest'
import { Routes, APIApplicationCommandOption } from 'discord-api-types/v9'
import { Interaction, Client, Intents, Collection } from 'discord.js'
import fs from 'fs'
import path from 'path'

require('dotenv').config()

interface CommandData {
  name: string
  description: string
  options: APIApplicationCommandOption[]
  default_permission: boolean
}

interface Command {
  data: CommandData
  run: (interaction: Interaction) => Promise<void>
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const clientId = process.env.NODE_ENV === 'production' ? settings.prodId : settings.devId

const commands = new Collection<string, Command>()
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'))

for (const file of commandFiles) {
  const command: Command = require(`./commands/${file}`)
  commands.set(command.data.name, command)
}

const scrambleFunc = require('./commands/scrambles/scramble.ts')

//  Create NNN scrambles
for (let i = 1, max: number, bld: string, fmc: string; i < 8; i++, bld = '', fmc = '') {
  max = i <= 4 ? 12 : 1.5 * Math.pow(i, 2) - 19.5 * i + 68
  bld = i <= 5 ? 'bld' : null
  fmc = i === 3 ? 'fmc' : null

  const scramble: Command = scrambleFunc.default(`${i}x${i}`, max, bld, fmc)
  commands.set(scramble.data.name, scramble)
}

//  Everything else listed in scrambles.json
const scrambleList = require('./util/scrambles.json')
for (const name in scrambleList) {
  const scramble: Command = scrambleFunc.default(name, scrambleList[name].max, '', '', scrambleList[name].fullName)
  commands.set(scramble.data.name, scramble)
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')
    await rest.put(
      process.env.NODE_ENV === 'development'
        ? Routes.applicationGuildCommands(clientId, settings.guildId) // register commands as guild commands in development (instantly updates)
        : Routes.applicationCommands(clientId), // otherwise, register commands globally (updates slower, up to an hour)
      { body: commands.map(command => command.data) }
    )
    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

// Client events
client.once('ready', () => { console.log('Ready!') })

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const command = commands.get(interaction.commandName)
  if (!command) return

  try {
    await command.run(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
  }
})

client.login(process.env.TOKEN)
