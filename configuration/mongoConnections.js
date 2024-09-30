import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = 'mongodb+srv://user:Password.1@clusterclassicmodels.squz1.mongodb.net/?retryWrites=true&w=majority&appName=ClusterClassicModels'
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connectMongoDB (collection) {
  try {
    await client.connect()
    const database = client.db('classicmodels')
    return database.collection(collection)
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export async function connectMongoDBandClient () {
  try {
    await client.connect()
    return client
  } catch (error) {
    console.error('Error connecting to client')
    console.error(error)
    await client.close()
  }
}
