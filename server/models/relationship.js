const mongoose = require("../db");
const logger = require("../config/winston");
const { User } = require("./user");

function isValidUser(userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then(user => {
        logger.debug(`Existing user: ${user.id}`);
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function areSourceAndDestinationDifferent() {
  const doc = this;
  if (doc.source.toString() !== doc.destination.toString()) {
    return true;
  } else {
    return false;
  }
}

function hasNoRelationship() {
  const doc = this;
  return new Promise((resolve, reject) => {
    User.findById(doc.source)
      .then(userSource => {
        logger.warn("userSource.relationships", userSource.relationships);
        const hasAlready =
          userSource.relationships.indexOf(doc.destination) !== -1;
        if (hasAlready) {
          throw new Error(
            `Cannot create a relationship between ${doc.source} and 
            ${doc.destination}. There is already one.`
          );
        } else {
          resolve(true);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

function isValidCategory(word) {
  return word === "like";
}

const manyValidators = [
  {
    validator: areSourceAndDestinationDifferent,
    msg: "`source` and `destination` must be different"
  },
  { validator: isValidUser, msg: "Invalid user" },
  {
    validator: hasNoRelationship,
    msg: "There is already a relationship between `source` and `destination`"
  }
];

const name = "Relationship";
const collection = "relationships";
const schema = new mongoose.Schema({
  source: {
    type: mongoose.Schema.Types.ObjectId,
    index: false,
    validate: manyValidators,
    ref: "User"
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    index: false,
    validate: isValidUser,
    ref: "User"
  },
  // Type of relationship. Could be named type, kind, category, nature, etc.
  // It could be also another Mongoose model with a reference to this model.
  category: {
    type: String,
    required: true,
    index: false,
    validate: isValidCategory
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Relationship = mongoose.model(name, schema, collection);

/* 
  If we managed to reach the "save" hook, it means that we passed the model
  validation, so we know we have valid users to build the relationship.

  Note: findAndUpdate does NOT execute any hooks (e.g. "save") or validation
  before making the change in the database. That's what we want here, because
  otherwise the user's password would be re-hashed in the User's "save" hook.
*/
schema.pre("save", function(next) {
  const doc = this;
  const promise = doc
    .populate("source", ["relationships"])
    .populate("destination", ["numLikes"])
    .execPopulate();
  promise
    .then(relationship => {
      const src = relationship.source;
      const dest = relationship.destination;
      const relationships = [...src.relationships, doc.destination.id];
      const numLikes = dest.numLikes + 1;
      logger.warn(`src.relationships: ${src.relationships}`);

      User.findByIdAndUpdate(
        doc.source,
        { $set: { relationships } },
        { new: true }
      ).then(user => {
        logger.debug(
          `user ${user.id} has now these relationships: ${user.relationships}`
        );
      });

      User.findByIdAndUpdate(
        doc.destination,
        { $set: { numLikes } },
        { new: true }
      ).then(user => {
        logger.debug(
          `user ${user.id} has now these numLikes: ${user.numLikes}`
        );
      });
    })
    .catch(err => {
      throw err;
    })
    .finally(next());
});

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
  deleteRelationship
};
