const mongoose = require("../server/db");
const {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  fakeUsersGenerator
} = require("../server/models/user");

async function run() {
  for (let obj of fakeUsersGenerator(20)) {
    console.log("obj", obj);
    const doc = await createUser(obj);
    console.log("CREATE", doc);
  }
  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
