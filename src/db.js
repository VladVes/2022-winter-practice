import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config, { isTestEnv } from './config';

let mongod = null;
async function initMongoMemoryServer() {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }
}

export async function dbConnect() {
  if (!isTestEnv) {
    mongoose.connect(config.dbUrl);
    return;
  }

  await initMongoMemoryServer();
  const uri = mongod.getUri();
  const mongooseOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(uri, mongooseOption);
}

export async function dbClose() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) {
    await mongod.stop();
  }
}

export async function dbClear() {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach((key) => {
    collections[key].deleteMany();
  });
}
