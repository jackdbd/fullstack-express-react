const mongoose = require("../db");
const logger = require("../config/winston");
const { User } = require("./user");

function isValidUser(userId) {
  logger.warn(`isValidUser ${userId}`);
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then(user => {
        if (!user) {
          throw new Error("Non-existing user");
        } else {
          logger.debug(`Existing user: ${user.id}`);
          resolve(true);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

function areSourceAndDestinationDifferent() {
  const doc = this;
  logger.warn("areSourceAndDestinationDifferent");
  const promise = doc
    .populate("source", ["id"])
    .populate("destination", ["id"])
    .execPopulate();

  // we need the return value of this promise
  return promise
    .then(relationship => {
      const src = relationship.source;
      const dest = relationship.destination;
      logger.debug(src.id, dest.id, src.id === dest.id);
      if (src.id === dest.id) {
        throw new Error("`source` and `destination` must be different");
      } else {
        return true;
      }
    })
    .catch(err => {
      throw err;
    });
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
    message: "`source` and `destination` must be different"
  },
  { validator: isValidUser, message: "Invalid user" },
  {
    validator: hasNoRelationship,
    message:
      "There is already a relationship between `source` and `destination`"
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

  TODO: refactor. Improve readability.
*/
schema.pre("save", function(next) {
  const doc = this;
  logger.debug("relationship.save (PRE hook)");
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
 * Update users after a relationship document is removed.
 *
 * Note that by design the Mongoose's middleware hook for remove is not fired
 * for Model.remove, only for ModelDocument.remove.
 * http://mongoosejs.com/docs/middleware.html
 */
schema.post("remove", function(doc) {
  // const doc = this;
  logger.debug("relationship.remove (POST hook)");
  return User.findById(doc.source)
    .then(user => {
      const relationships = user.relationships.filter(
        r => r.toString() !== doc.destination.toString()
      );
      logger.debug("User before update", user.relationships);
      return User.findByIdAndUpdate(
        user.id,
        { $set: { relationships } },
        { new: true }
      )
        .then(userNew => {
          logger.debug("User after update", userNew.relationships);
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
});

/**
 * Delete a relationship identified by its id and update the users.
 *
 * We need to do these things:
 * 1. find the Relationship by its id and remove it from the "relationships"
 *    collection
 * 2. find the User who is the "source" of this Relationship and remove this
 *    Relationship from his relationships list.
 * Note: no change on the "destination" User of the Relationship has to be made.
 *
 * @param {String} id
 */
async function deleteRelationshipAndUpdateUsers(id) {
  let doc;
  try {
    doc = await Relationship.findById(id);
  } catch (err) {
    throw err;
  }
  try {
    const docRemoved = await doc.remove();
    return docRemoved;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  Relationship,
  deleteRelationshipAndUpdateUsers
};
