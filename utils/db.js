const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
require("dotenv").config();

let cloudantClient;
let usersDb;

// ⏳ Timeout utility
const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("⏳ Cloudant connection timeout")), ms)
  );

const connectDB = async () => {
  // ✅ Step 1: Ensure all required environment variables are present
  const requiredEnvVars = [
    "CLOUDANT_API_KEY",
    "CLOUDANT_USERNAME",  // used in dashboard, even if not in code
    "CLOUDANT_URL",
    "DB_NAME_USERS",
    "DB_NAME_TASKS", // you may need this later
  ];

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      console.error(`❌ Missing required environment variable: ${key}`);
      throw new Error(`Missing env: ${key}`);
    }
  }

  if (!cloudantClient) {
    const authenticator = new IamAuthenticator({
      apikey: process.env.CLOUDANT_API_KEY, // ✅ Correct key
    });

    cloudantClient = CloudantV1.newInstance({ authenticator });
    cloudantClient.setServiceUrl(process.env.CLOUDANT_URL);

    try {
      await Promise.race([
        cloudantClient.getAllDbs(),
        timeout(10000),
      ]);

      usersDb = process.env.DB_NAME_USERS;
      console.log("✅ Cloudant: Connected successfully");
    } catch (err) {
      console.error("❌ Cloudant connection failed:", err.message);
      throw new Error("Cloudant DB connection failed");
    }
  }

  return { cloudantClient, usersDb };
};

module.exports = connectDB;
