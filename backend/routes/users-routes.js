const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const imageUpload = require("../middleware/image-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", usersController.getUser);

router.post(
  "/signup",
  imageUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email")
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

router.use(checkAuth);

router.patch("/", usersController.updateUser);

module.exports = router;
