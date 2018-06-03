const mongoose = require("mongoose");

const name = "Relationship";
const collection = "relationships";
const RelationshipSchema = new mongoose.Schema({
  // User A
  source: {
    type: mongoose.Schema.Types.ObjectId,
    index: false,
    ref: "User"
  },
  // User B
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

const Relationship = mongoose.model(name, RelationshipSchema, collection);

async function createRelationship(obj) {
  try {
    const doc = await new Relationship(obj).save();
    return doc;
  } catch (err) {
    throw err;
  }
}

async function deleteRelationship(id) {
  try {
    const doc = await Relationship.findByIdAndRemove({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  Relationship,
  createRelationship,
  deleteRelationship
};
