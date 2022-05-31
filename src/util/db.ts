import { Db, MongoClient } from 'mongodb'

let client: MongoClient
let db: Db

const connect = async (): Promise<void> => {
  console.log('[DB] Connecting to database...')
  client = new MongoClient(process.env.MONGO_URI)
  await client.connect()
  console.log('[DB] Complete.')
  db = client.db('Scrambler')
}

export {
  connect,
  client,
  db
}
