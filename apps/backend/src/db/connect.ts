import Todo from "@/db/model/Todo";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "sado";

export const client = new MongoClient(uri);
export const db = client.db(dbName);

export default async function connectToMongoDB() {
  try {
    await client.connect();

    // Create collection with schema validation if it doesn't exist
    const collections = await db.listCollections().toArray();
    if (!collections.some((col) => col.name === "todos")) {
      await db.createCollection("todos", {
        validator: {
          $jsonSchema: Todo,
        },
      });

      // Create indexes
      await db.collection("todos").createIndex({ id: 1 }, { unique: true });
      await db.collection("todos").createIndex({ title: 1 });
      await db.collection("todos").createIndex({ completed: 1 });
    }

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
