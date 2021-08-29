/* eslint-disable @typescript-eslint/no-var-requires */
// import { MongoClient } from 'mongodb'
// import { MongoDBProvider } from 'commando-provider-mongo'
import * as settings from '../settings'
import { REST } from '@discordjs/rest'
import {
  Routes,
  APIApplicationCommandOption
} from 'discord-api-types/v9'
import {
  Interaction,
  Client,
  Intents,
  Collection
} from 'discord.js'
import fs from 'fs'
import path from 'node:path'

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
  help: any
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const commands = new Collection<string, Command>()

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.ts'))
const dataArr = []

const clientId = process.env.NODE_ENV === 'production' ? settings.prodId : settings.devId
const guildId = '423525617598988288'

for (const file of commandFiles) {
  const command: Command = require(`./commands/${file}`)
  commands.set(command.data.name, command)
  dataArr.push(command.data)
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      process.env.NODE_ENV === 'development'
        ? Routes.applicationGuildCommands(clientId, guildId) // register commands as guild commands in development (instantly updates)
        : Routes.applicationCommands(clientId), // otherwise, register commands globally (updates slower, up to an hour)
      { body: dataArr }
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

// Client events
client.once('ready', () => {
  console.log('Ready!')
})

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
