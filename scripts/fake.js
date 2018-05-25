require("dotenv").load();
const mongoose = require("mongoose");
const dummy = require("mongoose-dummy");

// TODO: use yargs to make a CLI?

const userSchema = new mongoose.Schema({
  name: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("users", userSchema);

async function saveUserInDB(user) {
  try {
    const user_doc = await new User(user).save();
    return user_doc;
  } catch (err) {
    throw err;
  }
}

function* fakeUsersGenerator(n) {
  let i = 0;
  while (i < n) {
    const randomObject = dummy(User, {
      ignore: ["_id", "created_at", "__v"],
      returnDate: true
    });
    i++;
    yield randomObject;
  }
}

async function run() {
  // no need to await on this, mongoose handles connection buffering
  mongoose.connect(process.env.MONGODB_URI);

  for (let user of fakeUsersGenerator(20)) {
    const user_doc = await saveUserInDB(user);
    console.log(`CREATE user: ${user_doc}`);
  }

  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
