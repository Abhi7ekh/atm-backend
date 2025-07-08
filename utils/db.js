// utils/db.js

const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
require("dotenv").config();

let cloudantClient;
let usersDb;

// ✅ Enhanced: Connection wrapper with global access & retry guard
const connectDB = async () => {
  if (!cloudantClient) {
    const authenticator = new IamAuthenticator({
      apikey: process.env.CLOUDANT_API_KEY,
    });

    cloudantClient = CloudantV1.newInstance({
      authenticator,
    });

    cloudantClient.setServiceUrl(process.env.CLOUDANT_URL);

    try {
      await cloudantClient.getAllDbs(); // test connection
      usersDb = process.env.CLOUDANT_DB;
      console.log("✅ Connected to IBM Cloudant");
    } catch (err) {
      console.error("❌ Cloudant connection error:", err.message);
      throw new Error("Cloudant DB connection failed");
    }
  }

  return { cloudantClient, usersDb };
};

module.exports = connectDB;
