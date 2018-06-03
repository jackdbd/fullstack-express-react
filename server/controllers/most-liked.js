const { User } = require("../models/user");
const logger = require("../config/winston");

/**
 * Return a list of all users, sorted by numLikes in descending order.
 *
 * @param {object} req Express HTTP request.
 * @param {object} res Express HTTP response.
 */
async function get(req, res) {
  let docs;
  try {
    logger.debug("Fetching [username, numLikes, _id] from MongoDB documents");
    docs = await User.find({}, ["username", "numLikes", "_id"], {
      sort: { numLikes: -1 }
    });
    logger.debug(`Found ${docs.length} documents in DB`);
    return res.json(
      docs.map(d => ({ username: d.username, numLikes: d.numLikes, id: d._id }))
    );
  } catch (err) {
    logger.error(err);
    return res.json({ error: err });
  }
}

module.exports = {
  get
};
