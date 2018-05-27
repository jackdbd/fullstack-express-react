const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const collection = "users";
const UserSchema = new mongoose.Schema({
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

UserSchema.pre("save", function(next) {
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

// UserSchema.methods.generateAuthToken = function() {
//   const user = this;
//   console.log("TODO: AUTH TOKEN");
// };

const User = mongoose.model(collection, UserSchema);

async function createUser(obj) {
  try {
    const doc = await new User(obj).save();
    return doc;
  } catch (err) {
    throw err;
  }
}

async function readUser(id) {
  try {
    return await User.findOne({ _id: id });
  } catch (err) {
    throw err;
  }
}

async function updateUser(id, obj) {
  const doc = await User.findById(id);
  if (!doc) return false;
  // I tried to use findByIdAndUpdate but I couldn't understand how to trigger
  // "save" to hash the password
  await User.findByIdAndRemove({ _id: doc._id });
  const newObj = Object.assign({}, obj, { _id: doc._id });
  return await createUser(newObj);
}

async function deleteUser(id) {
  try {
    const doc = await User.findByIdAndRemove({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
}

async function getUserById(id) {
  // if (!mongoose.Types.ObjectId.isValid(id)) throw new Error()
  let user;
  try {
    user = await User.findOne({ _id: id });
  } catch (err) {
    throw err;
  }
  if (user) {
    return user;
  } else {
    return false;
  }
}

// module.exports.comparePassword = function(candidatePassword, hash, callback) {
//   bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     if (err) throw err;
//     callback(null, isMatch);
//   });
// };

module.exports = {
  User,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  getUserById
};
