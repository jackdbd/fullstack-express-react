const mongoose = require("../server/db");
const {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  User
} = require("../server/models/user");
const {
  deleteRelationship,
  Relationship
} = require("../server/models/relationship");

async function run() {
  // const objUser1 = {
  //   username: "some-username",
  //   email: "some-email@some-provider.com",
  //   password: "some-password"
  // };
  // console.log("Object from the frontend", objUser1);

  // const doc1 = await createUser(objUser1);
  // console.log("CREATE", doc1);

  // const docRead = await readUser(doc1._id);
  // console.log(`READ ${doc1._id}`, docRead);

  // const objUser1New = {
  //   username: "updated-username",
  //   email: "some-email@some-provider.com",
  //   password: "updated-password"
  // };
  // const docUpdated = await updateUser(doc1._id, objUser1New);
  // console.log(`UPDATE ${doc1._id}`, docUpdated);

  // const objUser2 = {
  //   username: "another-username",
  //   email: "another-email@another-provider.com",
  //   password: "another-password"
  // };
  // const doc2 = await createUser(objUser2);

  // const objRelationship = {
  //   source: doc1._id,
  //   destination: doc2._id,
  //   category: "like"
  // };

  // let rel;
  // try {
  //   rel = await createRelationship(objRelationship);
  //   console.log("createRelationship", rel);
  // } catch (err) {
  //   console.log("CATCH createRelationship", err);
  // }

  // const relationships = await Relationship.find({
  //   source: objRelationship.source,
  //   destination: objRelationship.destination
  // })
  //   .populate("source", ["username", "numLikes"])
  //   .populate("destination", ["username", "numLikes"])
  //   .exec();
  // console.log("RELATIONSHIPS", relationships);

  // try {
  //   rel = await deleteRelationship(relationships[0].id);
  //   console.log("deleteRelationship", rel);
  // } catch (err) {
  //   console.log("CATCH deleteRelationship", err);
  // }

  // console.log(`DELETE ${doc1._id} and ${doc2._id}`);
  // await deleteUser(doc1._id);
  // await deleteUser(doc2._id);

  const obj = {
    source: "5b196641891cb74cdfe8457a",
    // source: "5b196641891cb74cdfe7457d",
    destination: "5b196641891cb74cdfe8457b",
    category: "like"
  };

  try {
    const rel = await Relationship.create(obj);
    console.log(rel);
  } catch (err) {
    console.error(err);
  }

  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
