// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { env } from "@/env";
import { MongoClient, ServerApiVersion } from "mongodb";

// Ensure the URI includes the database name
const uri = env.MONGODB_URI.includes("/?")
  ? env.MONGODB_URI.replace("/?", `/${env.DATABASE_NAME}?`)
  : env.MONGODB_URI.endsWith("/")
    ? `${env.MONGODB_URI}${env.DATABASE_NAME}`
    : `${env.MONGODB_URI}/${env.DATABASE_NAME}`;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Helper function to get the database
export function getDatabase() {
  return client.db();
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client;
