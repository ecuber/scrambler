/* eslint-disable @typescript-eslint/no-var-requires */
import * as settings from '../settings'
import { REST } from '@discordjs/rest'
import { Routes, APIApplicationCommandOption } from 'discord-api-types/v9'
import { Interaction, Client, Intents, Collection, MessageEmbed, TextChannel, Guild } from 'discord.js'
import { AutoPoster } from 'topgg-autoposter'

import { dataBuilder, relays, runBuilder } from './util/relays'
import * as db from './util/db'
import scrambleFunc from './commands/scrambles/scramble'
import scrambleList from './util/scrambles.json'
import { otherCommands } from './commands'
import { ClusterClient, getInfo } from 'discord-hybrid-sharding'

require('dotenv').config()

/* *******************************
             TYPES
 ********************************/

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

/* *******************************
      SETUP & COMMAND LOADER
 ********************************/

export interface ExtClient extends Client {
  cluster?: ClusterClient<Client>
}

const client: ExtClient = new Client({
  intents: [Intents.FLAGS.GUILDS],
  shards: getInfo().SHARD_LIST, // An array of shards that will get spawned
  shardCount: getInfo().TOTAL_SHARDS // Total number of shards
})

client.cluster = new ClusterClient(client) // initialize the Client, so we access the .broadcastEval()

db.connect()
  .then(() => {
    console.log('Successfully connected to database.')
  })
  .catch((err) => {
    console.error('Error while connecting to db:', err)
  })

export const trackCmd = async (cmdName: string, cmdGuild: Guild): Promise<void> => {
  // console.log(db.db)
  if (db.db !== undefined) {
    await db.db.collection('stats').findOneAndUpdate(
      {},
      {
        $inc: { [cmdName]: 1 }
      },
      {
        upsert: true
      }
    )
  }
}

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

// Non-scramble commands
otherCommands.forEach(command => {
  commands.set(command.data.name, command as Command)
})

/* *******************************
     REGISTER SLASH COMMANDS
 ********************************/

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

/* *******************************
         EVENT HANDLERS
 ********************************/

client.once('ready', async () => {
  console.log('Scrambler is online!')
  const clusterGuilds = await client.cluster.fetchClientValues('guilds.cache.size')
  const guilds = clusterGuilds.reduce((acc: number, guildCount: number) => acc + guildCount, 0)
  client.user.setPresence({ activities: [{ name: `Scrambling cubes for ${guilds as number} servers! | Try me with /scrambles` }], status: 'online' })
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

async function handleGuildUpdate (guild: Guild): void {
  const clusterGuilds = await client.cluster.fetchClientValues('guilds.cache.size')
  const guilds = clusterGuilds.reduce((acc: number, guildCount: number) => acc + guildCount, 0)
  client.user.setPresence({ activities: [{ name: `Scrambling cubes for ${guilds as number} servers! | Try me with /scrambles` }], status: 'online' })
}

client.on('guildCreate', async guild => {
  console.log(`Joined guild: ${guild.name} (${guild.id})`)
  handleGuildUpdate(guild)

  const embed = {
    embeds: [
      new MessageEmbed()
        .setColor('#64d175')
        .setThumbnail(guild.iconURL())
        .setTitle('Joined Guild:')
        .addFields([
          { name: 'Name', value: `**${guild.name}** [ID: ${guild.id}]` },
          { name: 'Member Count', value: `${guild.memberCount}` }
        ])
        .setTimestamp()
    ]
  }
  await client.cluster.broadcastEval(`this.channels.cache.fetch(${settings.guildLog}).send(${JSON.stringify(embed)})`)
})

client.on('guildDelete', async guild => {
  console.log(`Left guild: ${guild.name} (${guild.id})`)
  handleGuildUpdate(guild)

  const embed = {
    embeds: [
      new MessageEmbed()
        .setColor('#64d175')
        .setThumbnail(guild.iconURL())
        .setTitle('Joined Guild:')
        .addFields([
          { name: 'Name', value: `**${guild.name}** [ID: ${guild.id}]` },
          { name: 'Member Count', value: `${guild.memberCount}` }
        ])
        .setTimestamp()
    ]
  }
  await client.cluster.broadcastEval(`this.channels.cache.fetch(${settings.guildLog}).send(${JSON.stringify(embed)})`)
})

client.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error)
})

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error)
})

client.login(process.env.TOKEN)

/* *******************************
      POST STATS TO TOP.GG
 ********************************/

if (process.env.NODE_ENV === 'production') {
  const ap = AutoPoster(process.env.DBL_KEY, client)

  ap.on('posted', () => {
    console.log('Successfully posted stats to Top.gg!')
  })
}
