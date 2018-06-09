const { User, createUser, updateUser, deleteUser } = require("../models/user");
const { Relationship, deleteRelationship } = require("../models/relationship");
const HttpStatus = require("http-status-codes");
const logger = require("../config/winston");

const NOT_FOUND = "RESOURCE NOT FOUND";

/* 
  TODO: double-check if the HTTP status code make sense, especially BAD REQUEST
  VS INTERNAL SERVER ERROR.
*/

/**
 * Get​ ​the​ ​user​ with the specified ID.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function get(req, res) {
  let user;
  let message;
  const { id } = req.params;
  logger.debug(`Trying to find user ${id}`);
  try {
    user = await User.getUserById(id);
  } catch (err) {
    logger.error(err);
    message = `There was an issue in finding user ${id}`;
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
  if (user) {
    const { username, numLikes } = user;
    return res.status(HttpStatus.OK).json({ username, numLikes });
  } else {
    logger.debug(`User ${id} not found`);
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }
}

/**
 * Like a user
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function like(req, res) {
  const { id } = req.params;
  const authUserId = res.locals.userId;
  logger.debug(`Auth user ${authUserId}`);
  logger.debug(`Trying to find user ${id}`);

  let message;
  if (id === authUserId) {
    message = "You cannot like yourself!";
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }

  let doc;
  try {
    doc = await User.getUserById(id);
  } catch (err) {
    logger.error(err);
    message = `There was an issue in finding user ${id}`;
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }
  if (!doc) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }

  const obj = {
    source: authUserId,
    destination: id,
    category: "like"
  };

  Relationship.create(obj)
    .then(rel => {
      console.log("THEN", rel);
    })
    .catch(err => {
      console.log("err", err);
    });

  try {
    // const rel = await createRelationship(obj);
    logger.debug(`Create relationship: ${id} likes ${doc.id}`);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err.stack });
  }

  /*
    numLikes could be a virtual property of a user. It's computed summing up all
    occurrences where he is a "destination" of a "like" relationship.
  */
  const newObj = Object.assign({}, doc._doc, {
    numLikes: doc._doc.numLikes + 1
  });
  message = `User ${doc.id} numLikes: ${doc.numLikes} -> ${newObj.numLikes}`;

  try {
    const newDoc = await updateUser(doc.id, newObj);
    return res.status(HttpStatus.OK).json({ message, old: doc, new: newObj });
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
}

/**
 * Unlike a user
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function unlike(req, res) {
  const { id } = req.params;
  const authUserId = res.locals.userId;
  logger.debug(`Auth user ${authUserId}`);
  logger.debug(`Trying to find user ${id}`);

  let message;
  if (id === authUserId) {
    message = "You cannot unlike yourself!";
    return res.status(HttpStatus.BAD_REQUEST).json({ error: message });
  }

  let doc;
  try {
    doc = await User.getUserById(id);
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!doc) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .json({ error: { message: NOT_FOUND } });
  }

  const authUser = await User.getUserById(authUserId);

  const relationships = await Relationship.find({
    source: authUserId,
    destination: id
  });
  if (relationships.length) {
    try {
      const rel = await deleteRelationship(relationships[0]._id);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: err.stack });
    }
  } else {
    message = `User ${authUserId} has no relationship with User ${id}`;
    return res.status(HttpStatus.NOT_FOUND).json({ error: { message } });
  }

  const newValue = doc._doc.numLikes - 1;
  const numLikes = newValue > 0 ? newValue : 0;
  const newObj = Object.assign({}, doc._doc, { numLikes });
  message = `User ${doc.id} numLikes: ${doc.numLikes} -> ${newObj.numLikes}`;

  try {
    const newDoc = await updateUser(doc.id, newObj);
    return res.status(HttpStatus.OK).json({ message, old: doc, new: newObj });
  } catch (err) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
}

/**
 * Delete a user.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function deleteId(req, res) {
  const { id } = req.params;
  logger.debug(`Trying to find user ${id}`);
  let user;
  try {
    user = await User.getUserById(id);
  } catch (err) {
    logger.error(err);
    res.status(HttpStatus.BAD_REQUEST).json({ error: err });
  }
  if (!user) {
    res.status(HttpStatus.NOT_FOUND).json({ error: { message: NOT_FOUND } });
  }

  logger.debug(`User ${id} found. Trying to remove it from DB`);
  let message;
  try {
    const doc = await deleteUser(id);
    message = `User ${id} remove from the database`;
    res.status(HttpStatus.OK).json({ message });
  } catch (err) {
    logger.error(err);
    message = `There was an issue removing the user ${id}`;
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: message });
  }
}

module.exports = {
  get,
  like,
  unlike,
  deleteId
};
