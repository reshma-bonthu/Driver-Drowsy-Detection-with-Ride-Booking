const { MongoClient } = require("mongodb");

const uri = process.env.CONN;

const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("safetyOnWheels");
    console.log("MongoDB connected");
  }
  return db;
}

module.exports = connectDB;
