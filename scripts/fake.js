const mongoose = require("../server/db");
const dummy = require("mongoose-dummy");
const { User, createUser } = require("../server/models/user");
const { Relationship } = require("../server/models/relationship");

function* fakeUsersGenerator(numFakes) {
  let i = 0;
  while (i < numFakes) {
    const fakeObj = dummy(User, {
      ignore: ["_id", "relationships", "created_at", "__v"],
      returnDate: true
    });
    i++;
    yield fakeObj;
  }
}

async function run() {
  // create some users

  for (let obj of fakeUsersGenerator(20)) {
    console.log("obj", obj);
    const doc = await createUser(obj);
    console.log("CREATE", doc);
  }

  /*
    Create some relationships between the users. Each relationship contains a
    reference to two users (source and destination). E.g. User A likes User B,
    but User B might not like User A back.
  */

  // const docs = await User.find({"numLikes": {$in: [0, 1, 2, 3, 4, 5]}})
  const docs = await User.find();
  const pivot = Math.floor(docs.length / 2);
  const groupA = docs.slice(0, pivot);
  const groupB = docs.slice(pivot, docs.length);

  // let rel;
  // for (let doc1 of groupA) {
  //   for (let doc2 of groupB) {
  //     rel = await new Relationship({
  //       source: doc1._id,
  //       destination: doc2._id,
  //       category: "like"
  //     });
  //     await rel.save();
  //     console.log(`Rel.: ${rel.id} (${doc1._id} -> ${doc2._id})`);
  //   }
  // }

  /*
    Now that we have users and relationships, we can retrieve the information
    about the "users" collection when we query the "relationships" collection.
    This is because we used references in both the User and the Relationship
    models.
    http://mongoosejs.com/docs/2.7.x/docs/populate.html
  */

  const relationships = await Relationship.find({})
    .populate("source", ["username", "numLikes"])
    .populate("destination", ["username", "numLikes"])
    .exec();
  console.log(relationships);

  // no need to await on this, mongoose handles connection buffering
  mongoose.connection.close();
}

run().catch(error => console.error(error.stack));
