const mongoose = require("../server/db");
const dummy = require("mongoose-dummy");
const { User, createUser } = require("../server/models/user");

function* fakeUsersGenerator(numFakes) {
  let i = 0;
  while (i < numFakes) {
    const fakeObj = dummy(User, {
      ignore: ["_id", "created_at", "__v"],
      returnDate: true
    });
    i++;
    yield fakeObj;
  }
}

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
