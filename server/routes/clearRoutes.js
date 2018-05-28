const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/signup", controllers.signup_post);
router.post("/login", controllers.login_post);
router.get("/most-liked", controllers.most_liked_get);

module.exports = router;
