require("dotenv").load();
const mongoose = require("mongoose");
const { User } = require("../server/models");

async function saveUserInDB(name) {
  try {
    const user = await new User({ name: name }).save();
    return user;
  } catch (err) {
    throw err;
  }
}

async function readUserFromDB(name) {
  try {
    return User.findOne({ name: name });
  } catch (err) {
    throw err;
  }
}

async function run() {
  // no need to await on this, mongoose handles connection buffering
  mongoose.connect(process.env.MONGODB_URI);

  // CREATE
  try {
    const user = await saveUserInDB("giacomo");
    console.log(`CREATE user: ${user}`);
  } catch (err) {
    throw err;
  }

  // READ
  try {
    const user = await readUserFromDB("giacomo");
    console.log(`READ user: ${user}`);
  } catch (err) {
    throw err;
  }

  // UPDATE (TODO)

  // DELETE (TODO)

  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
