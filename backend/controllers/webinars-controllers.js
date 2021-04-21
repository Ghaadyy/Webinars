const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Webinar = require("../models/webinar");
const User = require("../models/user");

const getWebinars = async (req, res, next) => {
  try {
    webinars = await Webinar.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a webinar.",
      500
    );
    return next(error);
  }

  res.json({
    webinars: webinars.map((webinar) => webinar.toObject({ getters: true })),
  });
};

const getWebinarById = async (req, res, next) => {
  const webinarId = req.params.wid;

  let webinar;
  try {
    webinar = await Webinar.findById(webinarId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a webinar.",
      500
    );
    return next(error);
  }

  if (!webinar) {
    const error = new HttpError(
      "Could not find webinar for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ webinar: webinar.toObject({ getters: true }) });
};

const getWebinarsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let webinars;
  let userWithWebinars;
  try {
    userWithWebinars = await User.findById(userId).populate("webinars");
  } catch (err) {
    const error = new HttpError(
      "Fetching webinars failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!userWithWebinars || userWithWebinars.webinars.length === 0) {
  //   return next(
  //     new HttpError("Could not find webinars for the provided user id.", 404)
  //   );
  // }

  res.json({
    webinars: userWithWebinars.webinars.map((webinar) =>
      webinar.toObject({ getters: true })
    ),
  });
};

const createWebinar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, category, date } = req.body;

  const createdWebinar = new Webinar({
    title,
    description,
    image: req.file.path,
    creator: req.userData.userId,
    category,
    date,
    replay: "",
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating webinar failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdWebinar.save({ session: sess });
    user.webinars.push(createdWebinar);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating webinar failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ webinar: createdWebinar });
};

const updateWebinar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const webinarId = req.params.wid;

  let webinar;
  try {
    webinar = await Webinar.findById(webinarId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update webinar.",
      500
    );
    return next(error);
  }

  if (webinar.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this webinar.",
      401
    );
    return next(error);
  }

  webinar.title = title;
  webinar.description = description;

  try {
    await webinar.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update webinar.",
      500
    );
    return next(error);
  }

  res.status(200).json({ webinar: webinar.toObject({ getters: true }) });
};

const deleteWebinar = async (req, res, next) => {
  const webinarId = req.params.wid;

  let webinar;
  try {
    webinar = await Webinar.findById(webinarId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete webinar.",
      500
    );
    return next(error);
  }

  if (!webinar) {
    const error = new HttpError("Could not find webinar for this id.", 404);
    return next(error);
  }

  if (webinar.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this webinar.",
      401
    );
    return next(error);
  }

  const imagePath = webinar.image;
  const replayPath = webinar.replay;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await webinar.remove({ session: sess });
    webinar.creator.webinars.pull(webinar);
    await webinar.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete webinar.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  fs.unlink(replayPath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted webinar." });
};

const addReplay = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const webinarId = req.params.wid;

  let webinar;
  try {
    webinar = await Webinar.findById(webinarId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update webinar.",
      500
    );
    return next(error);
  }

  if (webinar.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this webinar.",
      401
    );
    return next(error);
  }
  const replayPath = webinar.replay;

  fs.unlink(replayPath, (err) => {
    console.log(err);
  });

  webinar.replay = req.file.path;

  try {
    await webinar.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update webinar.",
      500
    );
    return next(error);
  }

  res.status(200).json({ webinar: webinar.toObject({ getters: true }) });
};

exports.addReplay = addReplay;
exports.getWebinars = getWebinars;
exports.getWebinarById = getWebinarById;
exports.getWebinarsByUserId = getWebinarsByUserId;
exports.createWebinar = createWebinar;
exports.updateWebinar = updateWebinar;
exports.deleteWebinar = deleteWebinar;
