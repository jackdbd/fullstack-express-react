const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dummy = require("mongoose-dummy");

const collection = "users";
const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId, auto: true },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  numLikes: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

schema.pre("save", function(next) {
  const doc = this;
  const rounds = 10;
  bcrypt.genSalt(rounds, (err, salt) => {
    bcrypt.hash(doc.password, salt, (err, hash) => {
      if (err) return next(err);
      doc.password = hash;
      // console.log("save", doc)
      next();
    });
  });
});

const model = mongoose.model(collection, schema);

async function createUser(obj) {
  try {
    const doc = await new model(obj).save();
    return doc;
  } catch (err) {
    throw err;
  }
}

async function readUser(id) {
  try {
    return await model.findOne({ _id: id });
  } catch (err) {
    throw err;
  }
}

async function updateUser(id, obj) {
  const doc = await model.findById(id);
  if (!doc) return false;
  // I tried to use findByIdAndUpdate but I couldn't understand how to trigger
  // "save" to hash the password
  await model.findByIdAndRemove({ _id: doc._id });
  const newObj = Object.assign({ _id: doc._id }, obj);
  return await createUser(newObj);
}

async function deleteUser(id) {
  try {
    await model.findByIdAndRemove({ _id: id });
  } catch (err) {
    throw err;
  }
}

function* fakeUsersGenerator(numFakes) {
  let i = 0;
  while (i < numFakes) {
    const fakeObj = dummy(model, {
      ignore: ["_id", "created_at", "__v"],
      returnDate: true
    });
    i++;
    yield fakeObj;
  }
}

module.exports = {
  User: model,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  fakeUsersGenerator
};
