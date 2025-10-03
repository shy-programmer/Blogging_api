const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');


mongoose.Promise = global.Promise;

class Database {
    constructor() {
        this.mongoServer = new MongoMemoryServer();
        this.connection = null;
    }

    async connect() {
        this.mongoServer = await MongoMemoryServer.create();
        const url = await this.mongoServer.getUri();
        this.connection = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    async disconnect() {
        await this.connection.disconnect();
        await this.mongoServer.stop();
    }

    async clear() {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
}

exports.connectInstance = async () => {
    const database = new Database();
    await database.connect();
    return database
}