import cube from 'scrambler-util'
import events = require('./aliases.json')
const names: Array<{name: string, level: number, parent: string}> = []
// Initializes names array
Object.keys(events).forEach(key => {
  names.push({ name: key, level: 0, parent: '' })
  events[key].aliases.forEach(alias => names.push({ name: alias, level: 1, parent: key }))
})

const variants = [
  '2x2', '222', '2', '3x3',
  '333', '3', '4x4', '444',
  '4', '5x5', '555', '5',
  '6x6', '666', '6', '7x7',
  '777', '7', 'oh', 'one-hand',
  'onehand', 'fmc', 'fewest', '3bld',
  'blind', '4bld', '5bld', 'clock',
  'pyra', 'pyram', 'pyraminx', 'mega',
  'megaminx', 'skewb', 'sq1', 'squan',
  'squareone', 'square-one', 'square1', 'square-1',
  'redi', 'redicube', 'redi-cube', 'ivy',
  'ivycube', 'ivy-cube', '2x2x3', 'tower'
] as const

type Event = typeof variants[number]

// const getInt = (input: string): (number | null) => [...input].filter(char => !isNaN(parseInt(char))).length === input.length ? parseInt(input) : null

/**
 * Returns the event name. If string is not a valid event name, throws TypeError
 * @param {string} string event input
 * @param {string} context whether or not in config
 * @returns {string} event name
 */
function getEvent (input: Event, context: string = ''): string {
  const matches = names.filter(n => n.name === input.toLowerCase())
  if (matches.length > 0) {
    const obj = matches[0]
    if (obj.level === 0) {
      return obj.name
    } else if (obj.parent !== '') {
      return obj.parent
    }
  }
  throw TypeError(`'${input}' is not a valid event.`)
}

function parseEvent (input: string): Event {
  const evs = names.map(obj => obj.name)
  if (evs.includes(input)) {
    return variants[evs.indexOf(input)]
  }
  throw TypeError(`${input} is not an Event.`)
}

// const compare = (a, b): number => (a > b) ? 1 : ((b > a) ? -1 : 0)

const allEvents = [...variants]

/**
   * @param event - Event to check
   * @returns Whether or not the event is ranked by best result.
   */
function isBestOf (event: Event): boolean {
  const { best } = events[getEvent(event)]
  return best !== undefined ? best : false
}

/**
     * Returns an array of top-level events that are not included in the array.
     * @param disabled disabled events
     * @returns Enabled events
     */
function getEnabled (disabled: string[] = []): string[] {
  const list: string[] = []
  const tles = names.filter(event => event.level === 0)
  tles.forEach(event => {
    if (disabled.length === 0 || !disabled.includes(event.name)) { list.push(event.name) }
  })
  return list
}

/**
     * Returns an array of all primary event names.
     */
function getEvents (): Event[] {
  return names.filter(obj => obj.level === 0).map(obj => parseEvent(obj.name))
}

/**
     * Utility function. Returns the scramble type for the specified event.
     * @param {string} event An event name or alias
     * @returns {string} Scramble type
     */
function getType (event: Event): string {
  return events[getEvent(event)].type
}

/**
     * Returns the formatted & capitalized name of an event
     * @param {string} event An event name or alias
     * @returns {string} Formatted name
     */
function getName (event: Event): string {
  return events[getEvent(event)].name
}

/**
     * Returns the number of scrambles for the specified event.
     * @param {string} event An event name or alias
     * @returns {Integer} Number of scrambles
     */
function countScrambles (event: Event): (number) {
  return events[getEvent(event)].scrambles
}

/**
     * Returns an array of scrambles for the specified event.
     * @param {string} event A valid event name or alias (from scrambler-util built-in aliases)
     * @param {int} count A positive integer for the number of scrambles
     * @param {string} args Whether scrambles should have FMC or BLD moves added on. Applicable for 2x2-5x5.
     * @returns {Array<string>} Scrambles for this event
     */
function getScrambles (
  event: string,
  count: number = this.countScrambles(event),
  args: ('fmc' | 'bld' | null) = null): string[] {
  return cube(event, count, args)
}

/**
     * Formats time from seconds to MM:SS.ss if necessary
     * @param {number} time A time in seconds
     * @returns {string} Formatted time string
     */
function formatTime (time: any): string {
  if (time !== 'DNF') {
    if (time >= 60) {
      const m = Math.floor(time / 60)
      let s = (time % 60).toFixed(2)
      if (Math.floor(time % 60) < 10) { s = `0${s}` }
      return `${m}:${s}`
    } else {
      return parseFloat(time).toFixed(2)
    }
  }
  return 'DNF'
}

export {
  Event,
  parseEvent,
  allEvents,
  getEvent,
  isBestOf,
  getEnabled,
  getEvents,
  getType,
  getName,
  countScrambles,
  getScrambles,
  formatTime
}
