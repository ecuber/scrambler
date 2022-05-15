import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import cube from 'scrambler-util'
import { CommandData } from '../app'
import { getType, Event } from './comp-util'

interface SubEvent { label: string, getScramble: () => string }

interface Relay { name: string, scrambles: SubEvent[], description: string }

const nxns = [
  '2-4', '2-5', '2-7', '4-7', '5-7'
]

function parseNxN (name: string): Relay {
  const lower = parseInt(name.charAt(0))
  const upper = parseInt(name.charAt(2))
  const scrambles: SubEvent[] = []

  for (let i = lower; i <= upper; i++) {
    scrambles.push({
      label: `${i}x${i}`,
      getScramble: () => cube(i.toString().repeat(3))[0]
    })
  }

  return {
    name,
    scrambles,
    description: `Generates scrambles for a ${lower}x${lower}-${upper}x${upper} relay.`
  }
}

const NxNs = nxns.map(name => parseNxN(name))

function mkEvent (tuple: [string, Event]): SubEvent {
  const [label, scrambleType] = tuple
  return {
    label: `${label}`,
    getScramble: () => cube(getType(scrambleType))[0]
  }
}

const fg = [
  ['OH', '333'], ['Feet', '333'], ['Clock', 'clock'], ['Square-1', 'sq1'],
  ['Pyraminx', 'pyra'], ['Skewb', 'skewb'], ['Megaminx', 'mega']
].map(tuple => mkEvent(tuple as [string, Event]))

const mg = [
  ['OH', '333'], ['Clock', 'clock'], ['Pyraminx', 'pyra'], ['Square-1', 'sq1'],
  ['Skewb', 'skewb'], ['Megaminx', 'mega']
].map(tuple => mkEvent(tuple as [string, Event]))

const funky = [
  {
    name: 'mini-guildford',
    scrambles: [...parseNxN('2-5').scrambles, ...mg],
    description: 'Generates scrambles for the Mini Guildford Challenge.'

  },
  {
    name: 'guildford',
    scrambles: [...parseNxN('2-7').scrambles, ...fg],
    description: 'Generates scrambles for the Guildford Challenge.'
  }
]

export const relays: Relay[] = [...NxNs, ...funky]

const relayScrambles = (relay: Relay): string => {
  let scrambleStr = ''
  relay.scrambles.forEach(event => {
    scrambleStr += `**${event.label}:** ${event.getScramble()}\n\n`
  })
  return scrambleStr
}

export const dataBuilder = (name: string, description: string): CommandData => {
  return new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .toJSON()
}

type Builder = (relay: Relay) => (interaction: CommandInteraction) => Promise<void>

export const runBuilder: Builder = (relay: Relay) => {
  return async (interaction: CommandInteraction) => {
    interaction.reply(relayScrambles(relay))
  }
}
