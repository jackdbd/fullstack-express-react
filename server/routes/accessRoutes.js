const express = require("express");
const { passport } = require("../middlewares");
const controllers = require("../controllers");

const router = express.Router();

router.post("/signup", controllers.signup_post);
// If POST /login fails, we redirect to GET /login (it's handled by React Router)
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  controllers.login_post
);

module.exports = router;
