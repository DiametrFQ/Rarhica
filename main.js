"use strict";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import "dotenv/config.js";

import router from "./router/router.js";

const DN = dirname(fileURLToPath(import.meta.url));

const app = express();
app.set("view engine", "ejs");
app.set("views", join(DN, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(DN, "static")));

const PORT = process.env.PORT || 3001;

app.use(router);

app.get("/", (_, res) => {
  res.render("home");
});

app.use((_, res) => {
  res.status(404);
  res.render("error", {
    status: 404,
    message: "Page not found",
  });
});

app.listen(PORT, () => console.log("server started on port", PORT));
