/* eslint-disable @typescript-eslint/no-var-requires */
import { ShardingManager } from 'discord.js'
require('dotenv').config()

const manager = new ShardingManager('./src/app.ts', {
  token: process.env.TOKEN,
  execArgv: ['-r', 'ts-node/register'],
  respawn: true
})

manager.on('shardCreate', async (shard) => {
  console.log(`Launched shard ${shard.id}`)
  shard.on('error', (error) => {
    console.error(error)
  })
})

manager.spawn({ amount: 'auto', delay: 15500, timeout: 60000 }).catch(e => console.log)
