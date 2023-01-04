/* eslint-disable @typescript-eslint/no-var-requires */
import { ShardingManager } from 'discord.js'
require('dotenv').config()

const manager = new ShardingManager('./src/app.ts', { token: process.env.TOKEN, execArgv: ['-r', 'ts-node/register'] })

manager.on('shardCreate', shard => { console.log(`Launched shard ${shard.id}`) })

manager.spawn()
