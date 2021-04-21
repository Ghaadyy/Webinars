const express = require("express");
const { check } = require("express-validator");

const webinarsControllers = require("../controllers/webinars-controllers");
const checkAuth = require("../middleware/check-auth");
const imageUpload = require("../middleware/image-upload");
const videoUpload = require("../middleware/video-upload");

const router = express.Router();

router.get("/browse", webinarsControllers.getWebinars);

router.get("/:wid", webinarsControllers.getWebinarById);

router.get("/user/:uid", webinarsControllers.getWebinarsByUserId);

router.use(checkAuth);

router.post(
  "/",
  imageUpload.single("image"),
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  webinarsControllers.createWebinar
);

router.patch(
  "/:wid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  webinarsControllers.updateWebinar
);

router.patch(
  "/replay/:wid",
  videoUpload.single("replay"),
  webinarsControllers.addReplay
);

router.delete("/:wid", webinarsControllers.deleteWebinar);

module.exports = router;
