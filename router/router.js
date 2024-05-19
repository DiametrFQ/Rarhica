"use strict";
import { Router } from "express";
import home from "./home/index.js";
import reg from "./registration/index.js";
import login from "./login/index.js";
import feedback from "./feedback/index.js";
import admin from "./administration/index.js";
import recipe from "./recipe/index.js";
import profile from "./profile/index.js";
import about from "./about/index.js";

const router = new Router();

router.use("/home", home);
router.use("/about", about);
router.use("/", login);
router.use("/registration", reg);
router.use("/feedback", feedback);
router.use("/administration", admin);
router.use("/recipe", recipe);
router.use("/profile", profile);

export default router;
