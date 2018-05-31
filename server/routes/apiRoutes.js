const express = require("express");
const { passport, authOrRedirect } = require("../middlewares");
const controllers = require("../controllers");
// const swaggerUi = require('swagger-ui-express');

// const swaggerDocument = require('./api-docs-swagger.json');
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
router.put("/user/:id/like", authOrRedirect, controllers.user_id_like_put);
router.put("/user/:id/unlike", authOrRedirect, controllers.user_id_unlike_put);
router.delete("/user/:id", controllers.user_id_delete);
router.get("/most-liked", controllers.most_liked_get);
// router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.post("/signup", controllers.signup_post);
// If POST /api/login fails, we redirect to GET /login (it's handled by React
// Router. Note: it's GET /login, not GET /api/login)
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  controllers.login_post
);

module.exports = router;
