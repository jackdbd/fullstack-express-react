const beautifyUnique = require("mongoose-beautiful-unique-validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("../db");
const logger = require("../config/winston");

const name = "User";
const collection = "users";
const schema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  username: {
    type: String,
    required: true,
    unique: "Two users cannot share the same username ({VALUE})"
  },
  email: {
    type: String,
    required: true,
    unique: "Two users cannot share the same email ({VALUE})"
  },
  password: {
    type: String,
    required: true,
    unique: "Two users cannot share the same password ({VALUE})",
    minlength: 8
  },
  numLikes: {
    type: Number,
    default: 0
  },
  relationships: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Relationship" }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

/* 
  The Mongoose "save" document middleware is a hook which is passed control
  during execution of asynchronous functions.
  In document middlewares, `this` refers to the BSON document stored in MongoDB.
  http://mongoosejs.com/docs/middleware.html
*/
schema.pre("save", function(next) {
  const doc = this;
  const SALT_ROUNDS = 10;
  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    bcrypt.hash(doc.password, salt, (err, hash) => {
      if (err) {
        // pass the error to the next middleware function
        return next(err);
      } else {
        // logger.info(hash);
        // don't commit to the database the user's password, but its hash
        doc.password = hash;
        next();
      }
    });
  });
});

schema.statics.getUserById = async function(id) {
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
};

schema.statics.getUserByUsername = async function(username) {
  let user;
  try {
    user = await User.findOne({ username });
  } catch (err) {
    throw err;
  }
  if (user) {
    return user;
  } else {
    return false;
  }
};

schema.statics.getUserByEmail = async function(email) {
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    throw err;
  }
  if (user) {
    return user;
  } else {
    return false;
  }
};

schema.statics.getUserByCredentials = async function(username, password) {
  let user;
  try {
    user = await User.getUserByUsername(username);
    logger.debug("getUserByCredentials: user found");
  } catch (err) {
    throw err;
  }
  let isMatch;
  try {
    isMatch = await User.comparePasswordWithHash(password, user.password);
  } catch (err) {
    throw err;
  }
  if (isMatch) {
    return user;
  } else {
    return false;
  }
};

schema.statics.comparePasswordWithHash = async function(password, hash) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    logger.debug(
      `comparePasswordWithHash: ${password} matches ${hash} ? ${isMatch} `
    );
    return isMatch;
  } catch (err) {
    throw err;
  }
};

schema.methods.generateAuthToken = async function() {
  const user = this;
  const payload = { _id: user._id.toHexString(), access: "auth" };
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: 3600 // 1 hour
  };
  try {
    token = jwt.sign(payload, secret, options).toString();
    return token;
  } catch (err) {
    throw err;
  }
};

/*
  Use mongoose-beautiful-unique-validation to turn MongoDB duplicate errors into
  regular Mongoose validation errors.
*/
schema.plugin(beautifyUnique);
const User = mongoose.model(name, schema, collection);

// TODO: remove these CRUD functions and use the Mongoose API

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

async function deleteUserIfAny(username) {
  const user = await User.getUserByUsername(username);
  if (user) {
    const deletedUser = await deleteUser(user._id);
    logger.debug("deleted user:", deletedUser);
  }
}

module.exports = {
  User,
  createUser,
  readUser,
  updateUser,
  deleteUser,
  deleteUserIfAny
};
