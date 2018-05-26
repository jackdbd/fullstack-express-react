const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.get("/signup", controllers.signup_get);
router.post("/signup", controllers.signup_post);
router.get("/login", controllers.login_get);
router.post("/login", controllers.login_post);
router.get("/most-liked", controllers.most_liked_get);

module.exports = router;
