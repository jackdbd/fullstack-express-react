const express = require("express");
const { authOrRedirect } = require("../middlewares");
const controllers = require("../controllers");

const router = express.Router();

/*
  We could use the following syntax, which will use the middleware function for
  every request specified in this module.
  router.use(authOrRedirect);
  However, I prefer to be more explicit and add the middleware for each route.
  router.get("/me", authOrRedirect, controllers.me_get);
*/

router.get("/me", authOrRedirect, controllers.me_get);
router.put(
  "/me/update-password",
  authOrRedirect,
  controllers.me_update_password_put
);
router.get("/user/:id", controllers.user_id_get);
// TODO
// router.put("/user/:id/like", authOrRedirect, controllers.user_id_like_put);
router.put("/user/:id/like", controllers.user_id_like_put);
router.put("/user/:id/unlike", authOrRedirect, controllers.user_id_unlike_put);
router.delete("/user/:id", controllers.user_id_delete);
router.get("/most-liked", controllers.most_liked_get);

module.exports = router;
