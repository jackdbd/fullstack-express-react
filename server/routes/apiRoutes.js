const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

router.post("/signup", controllers.signup_post);
router.post("/login", controllers.login_post);
router.get("/me", controllers.me_get);
router.put("/me/update-password", controllers.me_update_password_put);
router.get("/user/:id/", controllers.user_id_get);
router.get("/user/:id/like", controllers.user_id_like_get);
router.get("/most-liked", controllers.most_liked_get);

module.exports = router;
