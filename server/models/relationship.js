const mongoose = require("mongoose");
const logger = require("../config/winston");
const { User, updateUser } = require("./user");

const name = "Relationship";
const collection = "relationships";
const schema = new mongoose.Schema({
  // user 1
  source: {
    type: mongoose.Schema.Types.ObjectId,
    index: false,
    ref: "User"
  },
  // user 2
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    index: false,
    ref: "User"
  },
  // Type of relationship. Could be named type, kind, category, nature, etc.
  // It could be also another Mongoose model with a reference to this model.
  category: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Relationship = mongoose.model(name, schema, collection);

/**
 * Create a new Relationship and save it to MongoDB.
 *
 * We need to do many things before creating a new Relationship document:
 * 1. find user1 and user2
 * 2. check that user 1 does NOT have a relationship with user2 already
 * 3. create the relationship document
 * 4. update user1 by appending user2.id to user1.relationships
 *
 * @param {Object} obj
 */
async function createRelationship(obj) {
  const user1 = await User.findOne({ _id: obj.source });
  const user2 = await User.findOne({ _id: obj.destination });
  if (!user1 || !user2) {
    throw new Error(
      `Impossible to create a relationship between ${obj.source} and 
      ${obj.destination}. Check that such users exist.`
    );
  }
  const hasRelationship = user1.relationships.indexOf(user2.id) !== -1;
  logger.debug(
    `${user1.id} has relationship with ${user2.id}?`,
    hasRelationship
  );

  if (hasRelationship) {
    throw new Error(
      `Cannot create a relationship between ${user1.id} and ${user2.id}. 
      There is already one.`
    );
  }

  let doc;
  try {
    doc = await new Relationship(obj);
  } catch (err) {
    throw err;
  }

  /*
    findAndUpdate/Remove do NOT execute any hooks (e.g. "save") or validation
    before making the change in the database. That's what we want here, because
    otherwise the user's password would be re-hashed in the "save" hook.
  */
  const relationships = [...user1.relationships, user2.id];
  const user = await User.findByIdAndUpdate(
    user1.id,
    { $set: { relationships } },
    { new: true }
  );
  logger.debug(
    `user ${user.id} has now these relationships: ${user.relationships}`
  );

  doc = await doc.save();
  logger.debug(`Relationship created: ${doc.id}`);
  return doc;
}

/**
 * Delete a relationships identified by its id.
 *
 * We need to take care of two model instances:
 * 1. find the Relationship by its id and remove it from the "relationships"
 *    collection
 * 2. find the User who is the "source" of this Relationship and remove this
 *    Relationship from his relationships list.
 * Note: no change on the "destination" User of the Relationship has to be made.
 *
 * @param {String} id
 */
async function deleteRelationship(id) {
  let doc;
  try {
    logger.debug(`Delete relationship ${id}`);
    doc = await Relationship.findByIdAndRemove({ _id: id });
  } catch (err) {
    throw err;
  }
  const user1 = await User.findById(doc.source);
  const relationships = user1.relationships.filter(
    r => r.toString() !== doc.destination.toString()
  );
  const user = await User.findByIdAndUpdate(
    user1.id,
    { $set: { relationships } },
    { new: true }
  );
  logger.debug(
    `user ${user.id} has now these relationships: ${user.relationships}`
  );
  return doc;
}

module.exports = {
  Relationship,
  createRelationship,
  deleteRelationship
};
