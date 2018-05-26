const express = require("express");
const { passport, authOrRedirect } = require("../middlewares");
const controllers = require("../controllers");

const router = express.Router();

// middleware that will happen on every request specified in this module
// router.use(authOrRedirect);

// TODO: move /me and /user to their own routes and import the middleware there too

router.get("/", controllers.index_get);
router.get("/me", controllers.me_get);
router.put("/me/update-password", controllers.me_update_password_put);
router.get("/user/:id/", controllers.user_id_get);
router.post("/user/:id/like", controllers.user_id_like_post);
router.post("/user/:id/unlike", controllers.user_id_unlike_post);

module.exports = router;
