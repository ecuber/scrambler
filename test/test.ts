import { expect } from 'chai'
// import assert from 'assert'
import { it, describe } from 'mocha'
import util, { Event, parseEvent } from '../src/util/comp-util'
import aliases = require('../src/util/aliases.json')

const compare = (a, b): number => (a > b) ? 1 : ((b > a) ? -1 : 0)
const primaries: Event[] = Object.keys(aliases).map(name => parseEvent(name)).sort((a, b) => compare(a, b))

describe('getEvent()', () => {
  it('supports primary names', () => {
    primaries.forEach(event => {
      expect(util.getEvent(event)).to.equal(event)
    })
  })
  it('supports aliases', () => {
    const tests: Event[] = []
    const expected: string[] = []
    Object.keys(aliases).forEach(key => {
      aliases[key].aliases.forEach(alias => {
        tests.push(alias)
        expected.push(key)
      })
    })
    tests.forEach((event, i) => {
      expect(util.getEvent(event)?.toLowerCase()).to.equal(expected[i])
    })
  })
})

describe('isBestOf()', () => {
  it('returns correct booleans', () => {
    const tests: Event[] = ['3x3', '444', 'squan', '3bld', 'fmc']
    const expected = [false, false, false, true, true]
    tests.forEach((event, i) => {
      expect(util.isBestOf(event)).to.equal(expected[i])
    })
  })
})

describe('getEvents()', () => {
  it('matches the simply evaluated list', () => {
    expect(util.getEvents().sort((a, b) => compare(a, b))).to.eql(primaries)
  })
})

describe('getEnabled()', () => {
  it('correctly removes disabled events', () => {
    const copy = [...primaries]
    const disabled: string[] = []
    const random = (): number => Math.floor(Math.random() * copy.length)
    for (let i = 0; i < random(); i++) {
      disabled.push(...copy.splice(random(), Math.floor(Math.random() * 3)))
    }
    expect(util.getEnabled(disabled).sort((a, b) => compare(a, b))).to.eql(copy)
  })
})

describe('countScrambles()', () => {
  it('returns correct scramble counts', () => {
    const tests: Event[] = ['3x3', '4x4', 'fmc', '3bld', 'skewb']
    const expected = [5, 5, 1, 3, 5]
    tests.forEach((event, i) => {
      expect(util.countScrambles(event)).to.equal(expected[i])
    })
  })
})

describe('formatTime()', () => {
  it('works for times under a minute', () => {
    expect(util.formatTime(59.99)).to.equal('59.99')
  })
  it('works for times over a minute', () => {
    expect(util.formatTime(83.56)).to.equal('1:23.56')
  })
  it('works for really big times', () => {
    expect(util.formatTime(999.345)).to.equal('16:39.35')
  })
  it('handles dnf appropriately', () => {
    expect(util.formatTime('DNF')).to.equal('DNF')
  })
})
