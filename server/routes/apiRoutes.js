/**
 * API routes.
 *
 * These routes should be used like this:
 * app.use("/api", apiRoutes);
 *
 * For the Express middlewares, we could use the following syntax, which uses
 * the middleware function for every request specified in this module:
 * router.use(authOrRedirect);
 *
 * However, I prefer to be more explicit and specify the middleware each time:
 * router.get("/me", authOrRedirect, controllers.me_get);
 *
 * @module routes/apiRoutes
 * @see app
 *
 */
const express = require("express");
const { passport, authOrRedirect } = require("../middlewares");
const user = require("../controllers/user");
const me = require("../controllers/me");
const mostLiked = require("../controllers/most-liked");
const access = require("../controllers/access");
// const swaggerUi = require('swagger-ui-express');

// const swaggerDocument = require('./api-docs-swagger.json');
const router = express.Router();

router.get("/me", authOrRedirect, me.get);
router.put("/me/update-password", authOrRedirect, me.updatePassword);
router.get("/user/:id", user.get);
router.put("/user/:id/like", authOrRedirect, user.like);
router.put("/user/:id/unlike", authOrRedirect, user.unlike);
router.delete("/user/:id", user.deleteId);
router.get("/most-liked", mostLiked.get);
// router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.post("/signup", access.signup);
/*
  Try to authenticate with a POST (username, password) on /api/login.
  If unsuccessful, redirect on /login (it's a GET which should NOT be catched by any Express route, but handled by React
  router instead).
*/
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  access.login
);

module.exports = router;
