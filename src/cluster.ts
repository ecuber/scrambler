/* eslint-disable @typescript-eslint/no-var-requires */
import { ClusterManager } from 'discord-hybrid-sharding'
import path from 'path'
require('dotenv').config()

const manager = new ClusterManager(path.join(__dirname, 'app.ts'), {
  totalShards: 'auto',
  shardsPerClusters: 2,
  mode: 'process', // you can also choose "worker"
  token: process.env.TOKEN,
  execArgv: ['-r', 'ts-node/register']
})

manager.on('clusterCreate', cluster => { console.log(`Launched Cluster ${cluster.id}`) })
manager.spawn({ timeout: -1 })
