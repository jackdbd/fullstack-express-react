const mongoose = require("../server/db");
const {
  createUser,
  readUser,
  updateUser,
  deleteUser
} = require("../server/models/user");

async function run() {
  const obj = {
    username: "some-username",
    email: "some-email@some-provider.com",
    password: "some-password"
  };
  console.log("Object from the frontend", obj);

  const docCreated = await createUser(obj);
  console.log("CREATE", docCreated);

  const id = docCreated._id;
  const docRead = await readUser(id);
  console.log(`READ ${id}`, docRead);

  const newObj = {
    username: "updated-username",
    email: "some-email@some-provider.com",
    password: "updated-password"
  };
  const docUpdated = await updateUser(id, newObj);
  console.log(`UPDATE ${id}`, docUpdated);

  console.log(`DELETE ${id}`);
  await deleteUser(id);

  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
