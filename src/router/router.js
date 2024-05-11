"use strict";
import { Router } from "express";
import home from "./home/index.js";
import reg from "./registration/index.js";
import feedback from "./feedback/index.js";
import admin from "./administration/index.js";

const router = new Router();

router.use("/home", home);
router.use("/registration", reg);
router.use("/feedback", feedback);
router.use("/administration", admin);

export default router;
