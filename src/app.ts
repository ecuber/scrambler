/* eslint-disable @typescript-eslint/no-var-requires */
// import { MongoClient } from 'mongodb'
// import { MongoDBProvider } from 'commando-provider-mongo'
import * as settings from '../settings'
import { REST } from '@discordjs/rest'
import { Routes, APIApplicationCommandOption } from 'discord-api-types/v9'
import { Interaction, Client, Intents, Collection, MessageEmbed, TextChannel } from 'discord.js'
import { dataBuilder, relays, runBuilder } from './util/relays'
import scrambleFunc from './commands/scrambles/scramble'

import scrambleList from './util/scrambles.json'
import { otherCommands } from './commands'

require('dotenv').config()

export interface CommandData {
  name: string
  description: string
  options: APIApplicationCommandOption[]
  default_permission: boolean
}

interface Command {
  data: CommandData
  run: (interaction: Interaction) => Promise<void>
}

// disable the s!help deprecation warning after July 31, 2022
export const client = new Client({ intents: [Intents.FLAGS.GUILDS, new Date() < new Date('2022-07-31T23:59:59') ? Intents.FLAGS.GUILD_MESSAGES : undefined] })

const clientId = process.env.NODE_ENV === 'production' ? settings.prodId : settings.devId

export const commands = new Collection<string, Command>()

//  Create NNN scrambles
for (let i = 1, max: number, bld: string, fmc: string; i < 8; i++, bld = '', fmc = '') {
  max = i <= 4 ? 12 : 1.5 * Math.pow(i, 2) - 19.5 * i + 68
  bld = i <= 5 ? 'bld' : null
  fmc = i === 3 ? 'fmc' : null

  const scramble: Command = scrambleFunc(`${i}x${i}`, max, bld, fmc)
  commands.set(scramble.data.name, scramble)
}

//  Everything else listed in scrambles.json
for (const name in scrambleList) {
  const scramble: Command = scrambleFunc(name, scrambleList[name].max, '', '', scrambleList[name].fullName)
  commands.set(scramble.data.name, scramble)
}

// Relays
relays.forEach(relay => {
  const relayCmd: Command = {
    data: dataBuilder(relay.name, relay.description),
    run: runBuilder(relay)
  }
  commands.set(relay.name, relayCmd)
})

// Create non-scramble commands
otherCommands.forEach(command => {
  commands.set(command.data.name, command as Command)
})

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
client.once('ready', () => {
  console.log('Scrambler is online!')
  client.user.setPresence({ activities: [{ name: `Scrambling cubes for ${client.guilds.cache.size ?? 0} servers! | Try me with /scrambles` }], status: 'online' })
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

client.on('guildCreate', async guild => {
  console.log(`Joined guild: ${guild.name} (${guild.id})`)
  const guildLog = await client.channels.fetch(settings.guildLog) as TextChannel
  if (guildLog.isText) {
    guildLog.send({
      embeds: [
        new MessageEmbed()
          .setColor('#64d175')
          .setThumbnail(guild.iconURL())
          .setTitle('Joined Guild:')
          .addField('Name', `**${guild.name}** [ID: ${guild.id}]`)
          .addField('Member Count', `${guild.memberCount}`)
          .setTimestamp()
      ]
    })
  }
  client.user.setPresence({ activities: [{ name: `Scrambling cubes for ${client.guilds.cache.size ?? 0} servers! | Try me with /scrambles` }], status: 'online' })
})

client.on('guildDelete', async guild => {
  console.log(`Left guild: ${guild.name} (${guild.id})`)
  const guildLog = await client.channels.fetch(settings.guildLog) as TextChannel
  if (guildLog.isText) {
    guildLog.send({
      embeds: [
        new MessageEmbed()
          .setColor('#d1646d')
          .setThumbnail(guild.iconURL())
          .setTitle('Left Guild:')
          .addField('Name', `**${guild.name}** [ID: ${guild.id}]`)
          .addField('Member Count', `${guild.memberCount}`)
          .setTimestamp()
      ]
    })
  }
  client.user.setPresence({ activities: [{ name: `Scrambling cubes for ${client.guilds.cache.size ?? 0} servers! | Try me with /scrambles` }], status: 'online' })
})

// only works if GUILD_MESSAGES intent is included.
client.on('messageCreate', async message => {
  if (message.content === 's!help' || message.content === '@scrambler#6144 help') {
    await message.channel.send('Scrambler now uses slash commands. Please try `/scrambles` to see available commands.')
  }
})

client.login(process.env.TOKEN)
