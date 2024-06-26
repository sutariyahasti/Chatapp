import { MongoClient } from 'mongodb';

if (!process.env.NEXT_MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.NEXT_MONGODB_URI;
console.log('MongoDB URI:', uri); // Add logging to check if the URI is being read correctly

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect()
            .then(() => {
                console.log('MongoDB connected in development mode');
                return client;
            })
            .catch(err => {
                console.error('MongoDB connection error in development mode:', err);
                throw err;
            });
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
        .then(() => {
            console.log('MongoDB connected in production mode');
            return client;
        })
        .catch(err => {
            console.error('MongoDB connection error in production mode:', err);
            throw err;
        });
}

export default clientPromise;




async function testConnection() {
    try {
        const client = await clientPromise;
        console.log('MongoDB connection successful');
        const db = client.db();
        console.log('Database:', db.databaseName);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

testConnection();
