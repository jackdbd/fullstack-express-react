const mongoose = require("../server/db");
const { User } = require("../server/models");

async function saveUserInDB(user) {
  try {
    const user_doc = await new User(user).save();
    return user_doc;
  } catch (err) {
    throw err;
  }
}

async function readUserFromDB(username) {
  try {
    return User.findOne({ username: username });
  } catch (err) {
    throw err;
  }
}

const someUser = {
  'username': 'some-username',
  'email': 'some-email@some-provider.com',
  'password': 'some-password'
}

async function run() {

  // CREATE
  try {
    const user_doc = await saveUserInDB(someUser);
    console.log(`CREATE user: ${user_doc}`);
  } catch (err) {
    throw err;
  }

  // READ
  try {
    const user_doc = await readUserFromDB(someUser.username);
    console.log(`READ user: ${user_doc}`);
  } catch (err) {
    throw err;
  }

  // UPDATE (TODO)

  // DELETE (TODO)

  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
